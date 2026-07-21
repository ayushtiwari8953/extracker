import { Router } from 'express';
import * as admin from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.use(protect, adminOnly);
router.get('/stats', admin.stats);
router.get('/users', admin.listUsers);
router.delete('/users/:id', admin.deleteUser);

export default router;
