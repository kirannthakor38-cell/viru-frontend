import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fullAddress: {
            type: String,
            required: [true, 'Full address is required'],
        },
        landmark: {
            type: String,
            default: '',
        },
        note: {
            type: String,
            default: '',
        },
        latitude: {
            type: Number,
            required: [true, 'Latitude is required'],
        },
        longitude: {
            type: Number,
            required: [true, 'Longitude is required'],
        },
    },
    {
        timestamps: true,
    }
);

const Address = mongoose.model('Address', addressSchema);

export default Address;
