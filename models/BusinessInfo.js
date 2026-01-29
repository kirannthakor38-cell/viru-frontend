import mongoose from 'mongoose';

const businessInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'KHUSHI PAPAD'
    },
    address: {
        type: String,
        required: true,
        default: '123, Food Street, Gujarat, India'
    },
    description: {
        type: String,
        required: true,
        default: 'We provide the best quality homemade papdi with authentic taste.'
    },
    contactNumber: {
        type: String,
        required: true,
        default: '+91 9876543210'
    },
    email: {
        type: String,
        default: 'info@khushipapad.com'
    },
    socialLinks: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        whatsapp: { type: String, default: '' }
    },
    images: [{
        data: Buffer,
        contentType: String,
        url: String
    }]
}, {
    timestamps: true
});

const BusinessInfo = mongoose.model('BusinessInfo', businessInfoSchema);
export default BusinessInfo;
