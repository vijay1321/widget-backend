import express from 'express';
import { getWidgets, getWidgetById, enableWidget, disableWidget } from '../controllers/widgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(getWidgets);
router.route('/:id').get(getWidgetById);
router.route('/:id/enable').post(protect, enableWidget);
router.route('/:id/disable').post(protect, disableWidget);

export default router;