import { Router } from 'express';
import * as report from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/monthly/:year/:month', report.monthly);
router.get('/annual/:year', report.annual);

export default router;
