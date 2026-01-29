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

// @desc    Get business image
// @route   GET /api/business/image/:id
// @access  Public
export const getBusinessImage = async (req, res) => {
    try {
        const info = await BusinessInfo.findOne();
        if (!info) {
            return res.status(404).json({ message: 'Business Info not found' });
        }

        const image = info.images.id(req.params.id);
        if (!image || !image.data) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.set('Content-Type', image.contentType || 'image/jpeg');
        res.send(image.data);
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
                // We need to save the info first to get IDs for new images if we wanted to generate URLs immediately,
                // but we can also just save the buffers and update URLs after.
                // However, Mongoose subdocuments get IDs on push.

                req.files.forEach(file => {
                    const newImage = {
                        data: file.buffer,
                        contentType: file.mimetype,
                        url: 'temp'
                    };
                    info.images.push(newImage);
                    const pushedImage = info.images[info.images.length - 1];
                    pushedImage.url = `/api/business/image/${pushedImage._id}`;
                });
            }

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
        const { imageUrl } = req.body; // Expecting { imageUrl: '/api/business/image/...' }
        let info = await BusinessInfo.findOne();

        if (info) {
            info.images = info.images.filter(img => img.url !== imageUrl);
            await info.save();
            res.json(info);
        } else {
            res.status(404).json({ message: 'Info not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
