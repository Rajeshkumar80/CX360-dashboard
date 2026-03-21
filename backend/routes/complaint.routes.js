import { Router } from 'express';
import { authenticate, roleGuard } from '../middleware/auth.middleware.js';
import {
  manualEntry, getComplaints, getComplaintById,
  updateStatus, resolveComplaint, exportCSV, getCustomerHistory
} from '../controllers/complaint.controller.js';

const router = Router();

router.get('/', authenticate, getComplaints);
router.get('/export/csv', authenticate, exportCSV);
router.get('/customer/:contact', authenticate, getCustomerHistory);
router.get('/:id', authenticate, getComplaintById);
router.post('/manual', authenticate, roleGuard('admin'), manualEntry);
router.patch('/:id/status', authenticate, roleGuard('admin'), updateStatus);
router.patch('/:id/resolve', authenticate, roleGuard('admin'), resolveComplaint);

export default router;
