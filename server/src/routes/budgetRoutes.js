import { Router } from 'express';
import * as budget from '../controllers/budgetController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', budget.list);
router.post('/', budget.create);
router.put('/:id', budget.update);
router.delete('/:id', budget.remove);
router.get('/status/:month', budget.status);

export default router;
