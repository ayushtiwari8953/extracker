import { Router } from 'express';
import * as txn from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', txn.list);
router.post('/', txn.create);
router.get('/summary', txn.summary);
router.put('/:id', txn.update);
router.delete('/:id', txn.remove);

export default router;
