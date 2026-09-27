import Widget from '../models/Widget.js';
import UserWidget from '../models/UserWidget.js';

export const getWidgets = async (req, res, next) => {
    try {
        const widgets = await Widget.find({ isActive: true });
        res.json(widgets);
    } catch (error) { next(error); }
};

export const getWidgetById = async (req, res, next) => {
    try {
        const widget = await Widget.findById(req.params.id);
        if (widget) {
            res.json(widget);
        } else {
            res.status(404); throw new Error('Widget not found');
        }
    } catch (error) { next(error); }
};

export const enableWidget = async (req, res, next) => {
    try {
        const { id } = req.params;
        const enabledAt = new Date();
        const expiresAt = new Date(enabledAt.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days

        let userWidget = await UserWidget.findOne({ userId: req.user._id, widgetId: id });
        if (userWidget) {
            userWidget.status = 'Enabled';
            userWidget.enabledAt = enabledAt;
            userWidget.expiresAt = expiresAt;
            await userWidget.save();
        } else {
            const widget = await Widget.findById(id);
            if (!widget) { res.status(404); throw new Error('Widget not found'); }
            
            userWidget = await UserWidget.create({
                userId: req.user._id,
                widgetId: id,
                status: 'Enabled',
                enabledAt,
                expiresAt,
                position: widget.defaultPosition,
                size: widget.defaultSize,
                animation: widget.defaultAnimation
            });
        }
        res.status(200).json(userWidget);
    } catch (error) { next(error); }
};

export const disableWidget = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userWidget = await UserWidget.findOne({ userId: req.user._id, widgetId: id });
        if (userWidget) {
            userWidget.status = 'Disabled';
            await userWidget.save();
            res.status(200).json(userWidget);
        } else {
            res.status(404); throw new Error('Enabled widget not found');
        }
    } catch (error) { next(error); }
};