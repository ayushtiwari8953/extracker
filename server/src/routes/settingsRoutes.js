import { Router } from 'express';
import * as settings from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', settings.get);
router.put('/', settings.update);

export default router;
