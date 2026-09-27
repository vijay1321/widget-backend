import mongoose from 'mongoose';

const widgetSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    previewImage: { type: String, default: '' },
    assetUrl: { type: String, required: true },
    defaultPosition: {
        x: { type: String, default: '90%' },
        y: { type: String, default: '0%' }
    },
    defaultSize: { type: String, default: 'medium' },
    defaultAnimation: {
        type: { type: String, default: 'sway' },
        speed: { type: String, default: 'slow' }
    },
    type: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Widget = mongoose.model('Widget', widgetSchema);
export default Widget;