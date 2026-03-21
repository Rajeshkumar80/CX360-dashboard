import cron from 'node-cron';
import Complaint from '../models/Complaint.js';
import { isDbConnected } from '../config/db.js';
import { mockComplaints } from '../services/mockStore.js';

const SLA_TARGETS = {
  Urgent: 4 * 60 * 60 * 1000,      // 4 hours
  High: 24 * 60 * 60 * 1000,       // 24 hours
  Medium: 48 * 60 * 60 * 1000,     // 48 hours
  Low: 72 * 60 * 60 * 1000,        // 72 hours
};

function calculateSLA(priority, createdAt) {
  const target = SLA_TARGETS[priority] || SLA_TARGETS.Medium;
  const elapsed = Date.now() - new Date(createdAt).getTime();
  const remaining = target - elapsed;
  const percentUsed = (elapsed / target) * 100;

  if (elapsed >= target) return 'breached';
  if (percentUsed >= 75) return 'approaching';
  return 'within';
}

export function startSLAChecker(io) {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      if (isDbConnected()) {
        const complaints = await Complaint.find({
          status: { $nin: ['resolved'] },
        });

        for (const complaint of complaints) {
          const newSLA = calculateSLA(complaint.priority, complaint.createdAt);
          if (newSLA !== complaint.slaStatus) {
            complaint.slaStatus = newSLA;
            await complaint.save();

            if (newSLA === 'breached' && io) {
              io.emit('sla-breach', {
                complaintId: complaint._id,
                caseId: complaint.caseId,
                priority: complaint.priority,
              });
            }
          }
        }
      } else {
        // Mock mode
        for (const complaint of mockComplaints) {
          if (complaint.status !== 'resolved') {
            complaint.slaStatus = calculateSLA(complaint.priority, complaint.createdAt);
          }
        }
      }
    } catch (err) {
      console.error('SLA Check error:', err.message);
    }
  });

  console.log('⏱ SLA Checker started (every 15 minutes)');
}

export { calculateSLA, SLA_TARGETS };
