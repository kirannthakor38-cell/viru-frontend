import Order from '../models/Order.js';

// @desc    Get assigned orders for delivery boy
// @route   GET /api/delivery/orders
// @access  Private/Delivery
export const getAssignedOrders = async (req, res) => {
    try {
        const orders = await Order.find({ deliveryBoyId: req.user._id })
            .populate('userId', 'name phone')
            .populate('items.papdiId', 'name image')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status by delivery boy
// @route   PUT /api/delivery/orders/:id/status
// @access  Private/Delivery
export const updateDeliveryStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status
        const validStatuses = ['assigned', 'out-for-delivery', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify this order is assigned to this delivery boy
        if (order.deliveryBoyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
