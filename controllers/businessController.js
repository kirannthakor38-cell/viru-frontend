import BusinessInfo from '../models/BusinessInfo.js';

// @desc    Get business info
// @route   GET /api/business
// @access  Public
export const getBusinessInfo = async (req, res) => {
    try {
        let info = await BusinessInfo.findOne();
        if (!info) {
            // Create default if not exists
            info = await BusinessInfo.create({});
        }
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update business info
// @route   PUT /api/business
// @access  Private/Admin
export const updateBusinessInfo = async (req, res) => {
    try {
        const { name, address, description, contactNumber, email, socialLinks } = req.body;

        let info = await BusinessInfo.findOne();

        if (info) {
            info.name = name || info.name;
            info.address = address || info.address;
            info.description = description || info.description;
            info.contactNumber = contactNumber || info.contactNumber;
            info.email = email || info.email;
            info.socialLinks = socialLinks || info.socialLinks;

            // Handle images if uploaded (expecting req.files array from multer)
            if (req.files && req.files.length > 0) {
                const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
                // Combine existing images or replace? Let's just append for now, or maybe replace logic in frontend?
                // For simplicity: Append new ones.
                info.images = [...info.images, ...imagePaths];
            }

            // If images data is sent as text (e.g. to remove images), handle that too?
            // For now, let's stick to adding images via upload or clearing all if requested (custom logic needed for rigorous management)

            const updatedInfo = await info.save();
            res.json(updatedInfo);
        } else {
            res.status(404).json({ message: 'Business Info not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete specific business image
// @route   DELETE /api/business/image
// @access  Private/Admin
export const deleteBusinessImage = async (req, res) => {
    try {
        const { imageUrl } = req.body; // Expecting { imageUrl: '/uploads/...' }
        let info = await BusinessInfo.findOne();

        if (info) {
            info.images = info.images.filter(img => img !== imageUrl);
            await info.save();
            res.json(info);
        } else {
            res.status(404).json({ message: 'Info not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
