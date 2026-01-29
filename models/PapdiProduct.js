import mongoose from 'mongoose';

const papdiProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        pricePerKg: {
            type: Number,
            required: [true, 'Price per kg is required'],
            min: 0,
        },
        image: {
            type: String,
            required: [true, 'Product image is required'],
        },
        ingredients: {
            type: String,
            required: [true, 'Ingredients description is required'],
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const PapdiProduct = mongoose.model('PapdiProduct', papdiProductSchema);

export default PapdiProduct;
