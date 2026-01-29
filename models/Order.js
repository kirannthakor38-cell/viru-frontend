import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                papdiId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'PapdiProduct',
                    required: true,
                },
                name: String,
                pricePerKg: Number,
                quantityKg: {
                    type: Number,
                    required: true,
                    min: 0.1,
                },
                totalPrice: Number,
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        address: {
            fullAddress: String,
            landmark: String,
            note: String,
            latitude: Number,
            longitude: Number,
        },
        deliveryBoyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        status: {
            type: String,
            enum: ['pending', 'assigned', 'out-for-delivery', 'delivered'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            default: 'COD',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
