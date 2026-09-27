import express from 'express';
import { getUserWidgets, getUserWidgetById } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/widgets').get(protect, getUserWidgets);
router.route('/widgets/:id').get(protect, getUserWidgetById);

export default router;