import express from 'express';
import { getBusinessInfo, updateBusinessInfo, deleteBusinessImage } from '../controllers/businessController.js';
import { protect, requireAdmin } from '../middlewares/auth.js';
import multer from 'multer';
import path from 'path';

// Multer Config (Reusing logic or importing upload middleware would be better, but quick inline for specific array handling)
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', getBusinessInfo);
router.put('/', protect, requireAdmin, upload.array('images', 5), updateBusinessInfo);
router.delete('/image', protect, requireAdmin, deleteBusinessImage);

export default router;
