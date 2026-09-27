import mongoose from 'mongoose';

const deviceSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    deviceId: { type: String, required: true },
    platform: { type: String, required: true },
    appVersion: { type: String, required: true },
    lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);
export default Device;