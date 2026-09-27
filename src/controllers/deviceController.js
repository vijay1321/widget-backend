import UserWidget from '../models/UserWidget.js';
import Device from '../models/Device.js';

// Stub authentication for device for now. The future Windows app will send a proper device token.
// Assuming it uses the standard Bearer token for now.
export const getDeviceWidgets = async (req, res, next) => {
    try {
        // Find all enabled widgets for this user
        const userWidgets = await UserWidget.find({ userId: req.user._id, status: 'Enabled' }).populate('widgetId');
        
        const now = new Date();
        const activeDecorations = [];
        
        for (let uw of userWidgets) {
            // Check expiry
            if (now > uw.expiresAt) {
                uw.status = 'Expired';
                await uw.save();
                continue;
            }
            
            // Format for Windows app
            activeDecorations.push({
                widgetId: uw._id,
                widgetName: uw.widgetId.name,
                widgetType: uw.widgetId.type,
                assetUrl: uw.widgetId.assetUrl,
                status: uw.status,
                enabledAt: uw.enabledAt,
                expiresAt: uw.expiresAt,
                position: uw.position,
                size: uw.size,
                rotation: uw.rotation,
                animation: uw.animation,
                configuration: uw.configuration
            });
        }
        
        res.json({ widgets: activeDecorations });
    } catch (error) { 
        next(error); 
    }
};

export const updatePosition = async (req, res, next) => {
    try {
        const { widgetId } = req.params;
        const { x } = req.body;
        
        let uw = await UserWidget.findOne({ userId: req.user._id, _id: widgetId });
        if (!uw) { res.status(404); throw new Error('Enabled widget not found'); }
        
        uw.position.x = x;
        uw.markModified('position');
        await uw.save();
        
        res.json({ success: true, position: uw.position });
    } catch (error) { next(error); }
};

export const registerDevice = async (req, res, next) => {
    try {
        const { deviceId, platform, appVersion } = req.body;
        let device = await Device.findOne({ userId: req.user._id, deviceId });
        if (device) {
            device.lastSeen = new Date();
            device.appVersion = appVersion;
            await device.save();
        } else {
            device = await Device.create({
                userId: req.user._id,
                deviceId,
                platform,
                appVersion,
                lastSeen: new Date()
            });
        }
        res.json({ success: true, device });
    } catch (error) { next(error); }
};

export const heartbeatDevice = async (req, res, next) => {
    try {
        const { deviceId } = req.body;
        await Device.findOneAndUpdate({ userId: req.user._id, deviceId }, { lastSeen: new Date() });
        res.json({ success: true });
    } catch (error) { next(error); }
};
