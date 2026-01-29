import express from 'express';
import {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    assignDeliveryBoy,
    updateOrderStatus,
    getDeliveryBoys,
} from '../controllers/orderController.js';
import { protect, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/user', protect, getUserOrders);
router.get('/delivery-boys', protect, requireAdmin, getDeliveryBoys);
router.get('/:id', protect, getOrderById);
router.get('/', protect, requireAdmin, getAllOrders);
router.put('/:id/assign', protect, requireAdmin, assignDeliveryBoy);
router.put('/:id/status', protect, updateOrderStatus);

export default router;
