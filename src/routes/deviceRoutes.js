import express from 'express';
import { getDeviceWidgets, registerDevice, heartbeatDevice, updatePosition } from '../controllers/deviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/widgets', protect, getDeviceWidgets);
router.patch('/widgets/:widgetId/position', protect, updatePosition);
router.post('/register', protect, registerDevice);
router.post('/heartbeat', protect, heartbeatDevice);

export default router;
