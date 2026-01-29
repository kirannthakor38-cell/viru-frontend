import express from 'express';
import {
    getAssignedOrders,
    updateDeliveryStatus,
} from '../controllers/deliveryController.js';
import { protect, requireDeliveryBoy } from '../middlewares/auth.js';

const router = express.Router();

router.get('/orders', protect, requireDeliveryBoy, getAssignedOrders);
router.put('/orders/:id/status', protect, requireDeliveryBoy, updateDeliveryStatus);

export default router;
