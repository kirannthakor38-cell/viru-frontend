import express from 'express';
import { signup, login, getProfile, createDeliveryBoy, getAllUsers, createUserByAdmin, updateUser, deleteUser } from '../controllers/authController.js';
import { protect, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/delivery-boy', protect, requireAdmin, createDeliveryBoy);
router.get('/users', protect, requireAdmin, getAllUsers);
router.post('/users', protect, requireAdmin, createUserByAdmin);
router.put('/users/:id', protect, requireAdmin, updateUser);
router.delete('/users/:id', protect, requireAdmin, deleteUser);

export default router;
