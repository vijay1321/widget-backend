import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Widget from '../models/Widget.js';

dotenv.config();

const createSVG = (emoji) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
        <!-- Thin rope -->
        <line x1="50" y1="0" x2="50" y2="200" stroke="#8B5A2B" stroke-width="2" />
        <!-- Knot -->
        <circle cx="50" cy="198" r="4" fill="#8B5A2B" />
        <!-- Hanging Object -->
        <text x="50" y="250" font-size="60" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

const createComboSVG = (emoji1, emoji2) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
        <line x1="50" y1="0" x2="50" y2="150" stroke="#8B5A2B" stroke-width="2" />
        <circle cx="50" cy="148" r="4" fill="#8B5A2B" />
        <text x="50" y="190" font-size="40" text-anchor="middle" dominant-baseline="middle">${emoji1}</text>
        <line x1="50" y1="210" x2="50" y2="230" stroke="#8B5A2B" stroke-width="2" />
        <text x="50" y="250" font-size="40" text-anchor="middle" dominant-baseline="middle">${emoji2}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

const widgets = [
    { 
        name: 'Lemon Charm', description: 'Fresh yellow lemon decoration hanging from your desktop.', category: 'Charm', type: 'hanging-lemon', 
        previewImage: createSVG('🍋'), assetUrl: createSVG('🍋'),
        defaultPosition: { x: '90%', y: '0%' }, defaultSize: 'medium', defaultAnimation: { type: 'sway', speed: 'slow' }
    },
    { 
        name: 'Green Chilli Charm', description: 'Traditional green chilli hanging for good luck.', category: 'Charm', type: 'hanging-chilli', 
        previewImage: createSVG('🌶️'), assetUrl: createSVG('🌶️'),
        defaultPosition: { x: '90%', y: '0%' }, defaultSize: 'medium', defaultAnimation: { type: 'sway', speed: 'slow' }
    },
    { 
        name: 'Lemon + Chilli', description: 'Classic lemon and chilli combination tied together.', category: 'Charm', type: 'hanging-lemon-chilli', 
        previewImage: createComboSVG('🍋', '🌶️'), assetUrl: createComboSVG('🍋', '🌶️'),
        defaultPosition: { x: '90%', y: '0%' }, defaultSize: 'medium', defaultAnimation: { type: 'sway', speed: 'slow' }
    },
    { 
        name: 'Flower Charm', description: 'Beautiful small flower decoration.', category: 'Nature', type: 'hanging-flower', 
        previewImage: createSVG('🌸'), assetUrl: createSVG('🌸'),
        defaultPosition: { x: '85%', y: '0%' }, defaultSize: 'medium', defaultAnimation: { type: 'sway', speed: 'slow' }
    },
    { 
        name: 'Bell Charm', description: 'Small decorative bell that sways naturally.', category: 'Ornament', type: 'hanging-bell', 
        previewImage: createSVG('🔔'), assetUrl: createSVG('🔔'),
        defaultPosition: { x: '85%', y: '0%' }, defaultSize: 'medium', defaultAnimation: { type: 'sway', speed: 'slow' }
    },
    { 
        name: 'Leaf Charm', description: 'Minimal natural green leaf design.', category: 'Nature', type: 'hanging-leaf', 
        previewImage: createSVG('🍃'), assetUrl: createSVG('🍃'),
        defaultPosition: { x: '90%', y: '0%' }, defaultSize: 'medium', defaultAnimation: { type: 'sway', speed: 'slow' }
    },
    { 
        name: 'Star Ornament', description: 'Cute decorative star hanging from a thin thread.', category: 'Ornament', type: 'hanging-star', 
        previewImage: createSVG('⭐'), assetUrl: createSVG('⭐'),
        defaultPosition: { x: '90%', y: '0%' }, defaultSize: 'medium', defaultAnimation: { type: 'sway', speed: 'slow' }
    },
    { 
        name: 'Cute Charm', description: 'Small minimal decorative character charm.', category: 'Cute', type: 'hanging-cute', 
        previewImage: createSVG('👻'), assetUrl: createSVG('👻'),
        defaultPosition: { x: '80%', y: '0%' }, defaultSize: 'medium', defaultAnimation: { type: 'sway', speed: 'slow' }
    },
    { 
        name: 'Traditional Hanging', description: 'Tasteful minimal traditional hanging ornament.', category: 'Ornament', type: 'hanging-traditional', 
        previewImage: createSVG('🏮'), assetUrl: createSVG('🏮'),
        defaultPosition: { x: '90%', y: '0%' }, defaultSize: 'medium', defaultAnimation: { type: 'sway', speed: 'slow' }
    },
    { 
        name: 'Minimal Ornament', description: 'Simple geometric hanging decoration.', category: 'Modern', type: 'hanging-minimal', 
        previewImage: createSVG('💠'), assetUrl: createSVG('💠'),
        defaultPosition: { x: '90%', y: '0%' }, defaultSize: 'medium', defaultAnimation: { type: 'sway', speed: 'slow' }
    }
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

seedDB();