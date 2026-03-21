import { Router } from 'express';
import { authenticate, roleGuard } from '../middleware/auth.middleware.js';
import { getChannelSettings, updateChannelSettings, testChannelConnection } from '../controllers/settings.controller.js';

const router = Router();

router.get('/channels', authenticate, roleGuard('admin'), getChannelSettings);
router.patch('/channels/:channel', authenticate, roleGuard('admin'), updateChannelSettings);
router.post('/channels/:channel/test', authenticate, roleGuard('admin'), testChannelConnection);

export default router;
