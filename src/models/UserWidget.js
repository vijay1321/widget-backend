import mongoose from 'mongoose';

const userWidgetSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    widgetId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Widget' },
    status: { type: String, enum: ['Enabled', 'Disabled', 'Expired'], default: 'Enabled' },
    enabledAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    position: {
        x: { type: String },
        y: { type: String }
    },
    size: { type: String },
    rotation: { type: Number, default: 0 },
    animation: {
        type: { type: String },
        speed: { type: String }
    },
    configuration: { type: Object, default: {} }
}, { timestamps: true });

const UserWidget = mongoose.model('UserWidget', userWidgetSchema);
export default UserWidget;