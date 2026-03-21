import Complaint from '../models/Complaint.js';
import { classifyComplaint } from '../services/claude.service.js';
import { isDbConnected } from '../config/db.js';
import { mockComplaints } from '../services/mockStore.js';
import { exportToCSV } from '../utils/exportCSV.js';

export async function manualEntry(req, res) {
  try {
    const { rawMessage, source, manualCategory, manualPriority, customerName, customerId, customerContact } = req.body;

    if (!rawMessage || rawMessage.length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters' });
    }

    const complaint = await classifyComplaint({
      source: source || 'manual',
      rawMessage,
      customerName,
      customerId,
      customerContact,
      manualCategory,
      manualPriority,
      processedBy: req.user._id,
    }, req.io);

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getComplaints(req, res) {
  try {
    const { page = 1, limit = 20, source, category, status, priority, search, dateFrom, dateTo } = req.query;

    if (!isDbConnected()) {
      let data = [...mockComplaints];
      if (source) data = data.filter(c => c.source === source);
      if (category) data = data.filter(c => c.category === category);
      if (status) data = data.filter(c => c.status === status);
      if (priority) data = data.filter(c => c.priority === priority);
      if (search) data = data.filter(c => c.rawMessage?.toLowerCase().includes(search.toLowerCase()) || c.customerName?.toLowerCase().includes(search.toLowerCase()));
      return res.json({ complaints: data, total: data.length, page: 1, pages: 1 });
    }

    const filter = {};
    if (source) filter.source = source;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.$text = { $search: search };
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const total = await Complaint.countDocuments(filter);
    const pages = Math.ceil(total / limit);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('processedBy', 'name');

    res.json({ complaints, total, page: parseInt(page), pages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getComplaintById(req, res) {
  try {
    if (!isDbConnected()) {
      const c = mockComplaints.find(c => c._id?.toString() === req.params.id);
      return c ? res.json(c) : res.status(404).json({ success: false, error: 'Not found' });
    }

    const complaint = await Complaint.findById(req.params.id).populate('processedBy', 'name');
    if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ['classified', 'resolved', 'escalated'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    if (!isDbConnected()) {
      const c = mockComplaints.find(c => c._id?.toString() === req.params.id);
      if (c) {
        c.status = status;
        if (status === 'resolved') c.resolvedAt = new Date();
      }
      return res.json(c || { success: false, error: 'Not found' });
    }

    const update = { status };
    if (status === 'resolved') update.resolvedAt = new Date();

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!complaint) return res.status(404).json({ success: false, error: 'Not found' });

    if (req.io) {
      req.io.emit('complaint-updated', { id: complaint._id, status, resolvedAt: complaint.resolvedAt });
      req.io.emit('analytics-update');
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function resolveComplaint(req, res) {
  try {
    const { resolutionNote } = req.body;
    if (!resolutionNote || resolutionNote.length < 5) {
      return res.status(400).json({ success: false, error: 'Resolution note required (min 5 characters)' });
    }

    if (!isDbConnected()) {
      const c = mockComplaints.find(c => c._id?.toString() === req.params.id);
      if (c) {
        c.status = 'resolved';
        c.resolvedAt = new Date();
        c.resolutionNote = resolutionNote;
      }
      return res.json(c || { success: false, error: 'Not found' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', resolvedAt: new Date(), resolutionNote },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ success: false, error: 'Not found' });

    if (req.io) {
      req.io.emit('complaint-updated', { id: complaint._id, status: 'resolved', resolvedAt: complaint.resolvedAt });
      req.io.emit('analytics-update');
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function exportCSV(req, res) {
  try {
    const { source, category, status, priority, dateFrom, dateTo } = req.query;

    let complaints;
    if (!isDbConnected()) {
      complaints = [...mockComplaints];
      if (source) complaints = complaints.filter(c => c.source === source);
      if (category) complaints = complaints.filter(c => c.category === category);
      if (status) complaints = complaints.filter(c => c.status === status);
    } else {
      const filter = {};
      if (source) filter.source = source;
      if (category) filter.category = category;
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo);
      }
      complaints = await Complaint.find(filter).sort({ createdAt: -1 }).lean();
    }

    const csv = exportToCSV(complaints);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=cx360-complaints-${new Date().toISOString().slice(0, 10)}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getCustomerHistory(req, res) {
  try {
    const { contact } = req.params;

    if (!isDbConnected()) {
      const history = mockComplaints.filter(c =>
        c.customerContact === contact || c.customerId === contact
      );
      const categories = {};
      let totalResTime = 0;
      let resolvedCount = 0;
      history.forEach(c => {
        categories[c.category] = (categories[c.category] || 0) + 1;
        if (c.resolvedAt && c.createdAt) {
          totalResTime += new Date(c.resolvedAt) - new Date(c.createdAt);
          resolvedCount++;
        }
      });
      const mostCommon = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
      return res.json({
        complaints: history,
        totalComplaints: history.length,
        mostCommonCategory: mostCommon ? mostCommon[0] : 'N/A',
        avgResolutionTime: resolvedCount > 0 ? Math.round(totalResTime / resolvedCount / 3600000) + ' hours' : 'N/A',
      });
    }

    const history = await Complaint.find({
      $or: [{ customerContact: contact }, { customerId: contact }],
    }).sort({ createdAt: -1 });

    const categories = {};
    let totalResTime = 0;
    let resolvedCount = 0;
    history.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
      if (c.resolvedAt && c.createdAt) {
        totalResTime += new Date(c.resolvedAt) - new Date(c.createdAt);
        resolvedCount++;
      }
    });
    const mostCommon = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

    res.json({
      complaints: history,
      totalComplaints: history.length,
      mostCommonCategory: mostCommon ? mostCommon[0] : 'N/A',
      avgResolutionTime: resolvedCount > 0 ? Math.round(totalResTime / resolvedCount / 3600000) + ' hours' : 'N/A',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
