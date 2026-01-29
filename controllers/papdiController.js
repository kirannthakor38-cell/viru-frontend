import PapdiProduct from '../models/PapdiProduct.js';

// @desc    Get all papdi products
// @route   GET /api/papdi
// @access  Public
export const getAllPapdi = async (req, res) => {
    try {
        const products = await PapdiProduct.find({ isAvailable: true }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single papdi product
// @route   GET /api/papdi/:id
// @access  Public
export const getPapdiById = async (req, res) => {
    try {
        const product = await PapdiProduct.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get papdi product image
// @route   GET /api/papdi/image/:id
// @access  Public
export const getPapdiImage = async (req, res) => {
    try {
        const product = await PapdiProduct.findById(req.params.id).select('+imageData');

        if (!product || !product.imageData) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.set('Content-Type', product.imageType || 'image/jpeg');
        res.send(product.imageData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new papdi product
// @route   POST /api/papdi
// @access  Private/Admin
export const createPapdi = async (req, res) => {
    try {
        const { name, pricePerKg, ingredients } = req.body;

        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const product = new PapdiProduct({
            name,
            pricePerKg,
            ingredients,
            imageData: req.file.buffer,
            imageType: req.file.mimetype,
            image: `/api/papdi/image/temp`, // Placeholder
        });

        const createdProduct = await product.save();

        // Update the image URL with the actual ID
        createdProduct.image = `/api/papdi/image/${createdProduct._id}`;
        await createdProduct.save();

        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update papdi product
// @route   PUT /api/papdi/:id
// @access  Private/Admin
export const updatePapdi = async (req, res) => {
    try {
        const { name, pricePerKg, ingredients, isAvailable } = req.body;

        const product = await PapdiProduct.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.pricePerKg = pricePerKg || product.pricePerKg;
            product.ingredients = ingredients || product.ingredients;
            product.isAvailable = isAvailable !== undefined ? isAvailable : product.isAvailable;

            // Update image if new one uploaded
            if (req.file) {
                product.imageData = req.file.buffer;
                product.imageType = req.file.mimetype;
                product.image = `/api/papdi/image/${product._id}`;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete papdi product
// @route   DELETE /api/papdi/:id
// @access  Private/Admin
export const deletePapdi = async (req, res) => {
    try {
        const product = await PapdiProduct.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
