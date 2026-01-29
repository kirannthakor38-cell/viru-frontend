import express from 'express';
import { getBusinessInfo, updateBusinessInfo, deleteBusinessImage, getBusinessImage } from '../controllers/businessController.js';
import { protect, requireAdmin } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getBusinessInfo);
router.get('/image/:id', getBusinessImage);
router.put('/', protect, requireAdmin, upload.array('images', 5), updateBusinessInfo);
router.delete('/image', protect, requireAdmin, deleteBusinessImage);

export default router;
