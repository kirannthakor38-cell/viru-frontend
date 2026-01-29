import express from 'express';
import {
    getAllPapdi,
    getPapdiById,
    createPapdi,
    updatePapdi,
    deletePapdi,
} from '../controllers/papdiController.js';
import { protect, requireAdmin } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getAllPapdi);
router.get('/:id', getPapdiById);
router.post('/', protect, requireAdmin, upload.single('image'), createPapdi);
router.put('/:id', protect, requireAdmin, upload.single('image'), updatePapdi);
router.delete('/:id', protect, requireAdmin, deletePapdi);

export default router;
