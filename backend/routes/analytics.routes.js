import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getSummary, byCategory, bySource, bySentiment, byPriority,
  getTrends, getSLABreaches, getEscalations, getRegulatory
} from '../controllers/analytics.controller.js';

const router = Router();

router.get('/summary', authenticate, getSummary);
router.get('/by-category', authenticate, byCategory);
router.get('/by-source', authenticate, bySource);
router.get('/by-sentiment', authenticate, bySentiment);
router.get('/by-priority', authenticate, byPriority);
router.get('/trends', authenticate, getTrends);
router.get('/sla-breaches', authenticate, getSLABreaches);
router.get('/escalations', authenticate, getEscalations);
router.get('/regulatory', authenticate, getRegulatory);

export default router;
