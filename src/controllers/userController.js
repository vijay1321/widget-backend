import UserWidget from '../models/UserWidget.js';
import Widget from '../models/Widget.js';

export const getUserWidgets = async (req, res, next) => {
    try {
        const userWidgets = await UserWidget.find({ userId: req.user._id }).populate('widgetId');
        
        // Auto-expire check
        let updated = false;
        const now = new Date();
        for (let uw of userWidgets) {
            if (uw.status === 'Enabled' && now > uw.expiresAt) {
                uw.status = 'Expired';
                await uw.save();
                updated = true;
            }
        }
        
        const currentWidgets = updated ? await UserWidget.find({ userId: req.user._id }).populate('widgetId') : userWidgets;
        res.json(currentWidgets);
    } catch (error) { next(error); }
};

export const getUserWidgetById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userWidget = await UserWidget.findOne({ userId: req.user._id, widgetId: id }).populate('widgetId');
        if (userWidget) {
            if (userWidget.status === 'Enabled' && new Date() > userWidget.expiresAt) {
                userWidget.status = 'Expired';
                await userWidget.save();
            }
            res.json(userWidget);
        } else {
            res.status(404); throw new Error('UserWidget not found');
        }
    } catch (error) { next(error); }
};