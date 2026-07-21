import { Router } from 'express';
import * as user from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(protect);
router.get('/', user.getProfile);
router.put('/', user.updateProfile);
router.put('/password', user.changePassword);
router.post('/avatar', upload.single('avatar'), user.uploadAvatar);

export default router;
