import { Router } from 'express';
import * as cat from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', cat.list);
router.post('/', cat.create);
router.delete('/:id', cat.remove);

export default router;
