import Complaint from '../models/Complaint.js';
import { isDbConnected } from '../config/db.js';
import { mockComplaints } from '../services/mockStore.js';

export async function getSummary(req, res) {
  try {
    if (!isDbConnected()) {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(Date.now() - 7 * 86400000);
      const monthStart = new Date(Date.now() - 30 * 86400000);
      return res.json({
        total: mockComplaints.length,
        today: mockComplaints.filter(c => new Date(c.createdAt) >= todayStart).length,
        thisWeek: mockComplaints.filter(c => new Date(c.createdAt) >= weekStart).length,
        thisMonth: mockComplaints.filter(c => new Date(c.createdAt) >= monthStart).length,
      });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(Date.now() - 7 * 86400000);
    const monthStart = new Date(Date.now() - 30 * 86400000);

    const [total, today, thisWeek, thisMonth] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ createdAt: { $gte: todayStart } }),
      Complaint.countDocuments({ createdAt: { $gte: weekStart } }),
      Complaint.countDocuments({ createdAt: { $gte: monthStart } }),
    ]);

    res.json({ total, today, thisWeek, thisMonth });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function aggregateField(field, res) {
  if (!isDbConnected()) {
    const counts = {};
    mockComplaints.forEach(c => {
      const val = c[field] || 'Unknown';
      counts[val] = (counts[val] || 0) + 1;
    });
    return res.json(Object.entries(counts).map(([name, count]) => ({ name, count })));
  }

  const data = await Complaint.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $project: { name: '$_id', count: 1, _id: 0 } },
    { $sort: { count: -1 } },
  ]);
  res.json(data);
}

export async function byCategory(req, res) {
  try { await aggregateField('category', res); } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function bySource(req, res) {
  try { await aggregateField('source', res); } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function bySentiment(req, res) {
  try { await aggregateField('sentiment', res); } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function byPriority(req, res) {
  try { await aggregateField('priority', res); } catch (err) { res.status(500).json({ error: err.message }); }
}

export async function getTrends(req, res) {
  try {
    if (!isDbConnected()) {
      const days = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        days.push({ date: d.toISOString().slice(0, 10), count: Math.floor(Math.random() * 15) + 1 });
      }
      return res.json(days);
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const data = await Complaint.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $project: { date: '$_id', count: 1, _id: 0 } },
      { $sort: { date: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getSLABreaches(req, res) {
  try {
    if (!isDbConnected()) {
      const breached = mockComplaints.filter(c => c.slaStatus === 'breached');
      return res.json({
        count: breached.length,
        complaints: breached,
      });
    }

    const breached = await Complaint.find({ slaStatus: 'breached' }).sort({ createdAt: -1 });
    res.json({
      count: breached.length,
      complaints: breached,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getEscalations(req, res) {
  try {
    if (!isDbConnected()) {
      const escalated = mockComplaints.filter(c => c.shouldEscalate || c.status === 'escalated');
      return res.json({
        count: escalated.length,
        complaints: escalated,
      });
    }

    const escalated = await Complaint.find({
      $or: [{ shouldEscalate: true }, { status: 'escalated' }],
    }).sort({ createdAt: -1 });
    res.json({
      count: escalated.length,
      complaints: escalated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getRegulatory(req, res) {
  try {
    if (!isDbConnected()) {
      const flagged = mockComplaints.filter(c => c.regulatoryFlag && c.regulatoryFlag !== 'None');
      return res.json({
        count: flagged.length,
        complaints: flagged,
      });
    }

    const flagged = await Complaint.find({
      regulatoryFlag: { $nin: ['None', null] },
    }).sort({ createdAt: -1 });
    res.json({
      count: flagged.length,
      complaints: flagged,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
