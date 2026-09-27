const fs = require('fs');
const path = require('path');

const dirs = [
    'src/config',
    'src/controllers',
    'src/models',
    'src/routes',
    'src/middleware',
    'src/utils'
];

dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

const files = {
    'src/config/db.js': `import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/widgetly');
        console.log(\`MongoDB Connected: \${conn.connection.host}\`);
    } catch (error) {
        console.error(\`Error: \${error.message}\`);
        process.exit(1);
    }
};

export default connectDB;`,

    'src/middleware/errorMiddleware.js': `export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};`,

    'src/middleware/authMiddleware.js': `import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    }
    if (!token) {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};`,

    'src/models/User.js': `import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;`,

    'src/models/Widget.js': `import mongoose from 'mongoose';

const widgetSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    previewImage: { type: String, default: '' },
    type: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Widget = mongoose.model('Widget', widgetSchema);
export default Widget;`,

    'src/models/UserWidget.js': `import mongoose from 'mongoose';

const userWidgetSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    widgetId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Widget' },
    status: { type: String, enum: ['Enabled', 'Expired'], default: 'Enabled' },
    enabledAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

const UserWidget = mongoose.model('UserWidget', userWidgetSchema);
export default UserWidget;`,

    'src/models/Device.js': `import mongoose from 'mongoose';

const deviceSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    deviceId: { type: String, required: true },
    platform: { type: String, required: true },
    appVersion: { type: String, required: true },
    lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);
export default Device;`,

    'src/controllers/authController.js': `import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) { res.status(400); throw new Error('User already exists'); }
        const user = await User.create({ name, email, password });
        if (user) {
            res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
        } else {
            res.status(400); throw new Error('Invalid user data');
        }
    } catch (error) { next(error); }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
        } else {
            res.status(401); throw new Error('Invalid email or password');
        }
    } catch (error) { next(error); }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({ _id: user._id, name: user.name, email: user.email });
        } else {
            res.status(404); throw new Error('User not found');
        }
    } catch (error) { next(error); }
};`,

    'src/controllers/widgetController.js': `import Widget from '../models/Widget.js';
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
            userWidget = await UserWidget.create({
                userId: req.user._id,
                widgetId: id,
                status: 'Enabled',
                enabledAt,
                expiresAt
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
            userWidget.status = 'Expired';
            userWidget.expiresAt = new Date();
            await userWidget.save();
            res.status(200).json({ message: 'Widget disabled successfully' });
        } else {
            res.status(404); throw new Error('Enabled widget not found');
        }
    } catch (error) { next(error); }
};`,

    'src/controllers/userController.js': `import UserWidget from '../models/UserWidget.js';
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
};`,

    'src/controllers/healthController.js': `export const getHealth = (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
};`,

    'src/routes/authRoutes.js': `import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;`,

    'src/routes/widgetRoutes.js': `import express from 'express';
import { getWidgets, getWidgetById, enableWidget, disableWidget } from '../controllers/widgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(getWidgets);
router.route('/:id').get(getWidgetById);
router.route('/:id/enable').post(protect, enableWidget);
router.route('/:id/disable').post(protect, disableWidget);

export default router;`,

    'src/routes/userRoutes.js': `import express from 'express';
import { getUserWidgets, getUserWidgetById } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/widgets').get(protect, getUserWidgets);
router.route('/widgets/:id').get(protect, getUserWidgetById);

export default router;`,

    'src/routes/healthRoutes.js': `import express from 'express';
import { getHealth } from '../controllers/healthController.js';

const router = express.Router();
router.route('/').get(getHealth);

export default router;`,

    'src/utils/seed.js': `import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Widget from '../models/Widget.js';

dotenv.config();

const widgets = [
    { name: 'Digital Clock', description: 'Minimal digital clock for your desktop.', category: 'Productivity', type: 'digital-clock' },
    { name: 'Analog Clock', description: 'Classic analog clock with smooth hands.', category: 'Productivity', type: 'analog-clock' },
    { name: 'Calendar', description: 'Monthly overview with today highlighted.', category: 'Productivity', type: 'calendar' },
    { name: 'Weather', description: 'Current weather and 5-day forecast.', category: 'Lifestyle', type: 'weather' },
    { name: 'Daily Quote', description: 'Inspiring quotes delivered daily.', category: 'Lifestyle', type: 'daily-quote' },
    { name: 'Pomodoro Timer', description: 'Focus and break timer based on the Pomodoro technique.', category: 'Focus', type: 'pomodoro' },
    { name: 'To-Do List', description: 'Simple checklist for daily tasks.', category: 'Productivity', type: 'todo-list' },
    { name: 'System Monitor', description: 'Monitor CPU, RAM, and network usage.', category: 'Utility', type: 'system-monitor' },
    { name: 'Focus Timer', description: 'Minimalistic timer for deep work sessions.', category: 'Focus', type: 'focus-timer' },
    { name: 'Quick Notes', description: 'Sticky notes for your desktop.', category: 'Productivity', type: 'quick-notes' }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/widgetly');
        await Widget.deleteMany();
        await Widget.insertMany(widgets);
        console.log('Widgets seeded successfully');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDB();`,

    '.env': `PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/widgetly
JWT_SECRET=supersecretjwtkey2026
CLIENT_URL=http://localhost:5173
WINDOWS_DOWNLOAD_URL=https://example.com/widgetly-setup.exe`,

    '.env.example': `PORT=5000
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
WINDOWS_DOWNLOAD_URL=`
};

for (const [filepath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(process.cwd(), filepath), content);
}

console.log('Backend files scaffolded successfully!');
