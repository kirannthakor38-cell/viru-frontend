import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = await Order.create({
            userId: req.user._id,
            items,
            totalAmount,
            address,
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/user
// @access  Private
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('items.papdiId', 'name image')
            .populate('deliveryBoyId', 'name phone')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('userId', 'name email phone')
            .populate('items.papdiId', 'name image')
            .populate('deliveryBoyId', 'name phone')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('items.papdiId', 'name image')
            .populate('deliveryBoyId', 'name phone');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign delivery boy to order
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
export const assignDeliveryBoy = async (req, res) => {
    try {
        const { deliveryBoyId } = req.body;

        // Verify delivery boy exists and has correct role
        const deliveryBoy = await User.findById(deliveryBoyId);
        if (!deliveryBoy || deliveryBoy.role !== 'delivery') {
            return res.status(400).json({ message: 'Invalid delivery boy' });
        }

        const order = await Order.findById(req.params.id);

        if (order) {
            order.deliveryBoyId = deliveryBoyId;
            order.status = 'assigned';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get delivery boys list
// @route   GET /api/orders/delivery-boys
// @access  Private/Admin
export const getDeliveryBoys = async (req, res) => {
    try {
        const deliveryBoys = await User.find({ role: 'delivery' }).select('-password');
        res.json(deliveryBoys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
