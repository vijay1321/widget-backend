const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://vrvijay2005_db_user:widget1321@ac-om4gmix-shard-00-00.9vug96t.mongodb.net:27017,ac-om4gmix-shard-00-01.9vug96t.mongodb.net:27017,ac-om4gmix-shard-00-02.9vug96t.mongodb.net:27017/widgetly?ssl=true&replicaSet=atlas-1zoddv-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

const Widget = mongoose.model('Widget', new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    previewImage: String,
    assetUrl: String,
    defaultPosition: Object,
    defaultSize: String,
    defaultAnimation: Object,
    type: String,
    isActive: Boolean
}));

const getSvgBase64 = (svgString) => {
    return 'data:image/svg+xml;base64,' + Buffer.from(svgString).toString('base64');
};

const realisticAssets = {
    'hanging-lemon': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
    <line x1="50" y1="0" x2="50" y2="200" stroke="#a08a70" stroke-width="1.5" />
    <circle cx="50" cy="200" r="4" fill="none" stroke="#d4af37" stroke-width="1.5"/>
    <rect x="48" y="204" width="4" height="6" fill="#d4af37" rx="1"/>
    <defs>
        <radialGradient id="lemonGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fff44f"/>
            <stop offset="60%" stop-color="#ffd700"/>
            <stop offset="100%" stop-color="#cca300"/>
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="2" dy="5" stdDeviation="4" flood-opacity="0.3"/>
        </filter>
        <radialGradient id="lemonHighlight" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
    </defs>
    <g filter="url(#shadow)">
        <!-- Leaf -->
        <path d="M 50 212 Q 70 200 75 220 Q 60 225 50 212" fill="#4caf50"/>
        <!-- Lemon Body -->
        <path d="M 50 210 C 80 215 90 250 80 275 C 70 300 50 300 40 295 C 20 285 20 240 25 225 C 30 210 40 208 50 210 Z" fill="url(#lemonGrad)"/>
        <!-- Texture dimples -->
        <circle cx="45" cy="235" r="0.8" fill="#cca300" opacity="0.5"/><circle cx="65" cy="250" r="1" fill="#cca300" opacity="0.4"/>
        <circle cx="55" cy="270" r="0.9" fill="#cca300" opacity="0.5"/><circle cx="35" cy="260" r="0.7" fill="#cca300" opacity="0.4"/>
        <circle cx="75" cy="265" r="0.8" fill="#cca300" opacity="0.5"/><circle cx="45" cy="280" r="1.1" fill="#cca300" opacity="0.4"/>
        <!-- Highlight curve -->
        <path d="M 50 210 C 80 215 90 250 80 275 C 70 300 50 300 40 295 C 20 285 20 240 25 225 C 30 210 40 208 50 210 Z" fill="url(#lemonHighlight)"/>
    </g>
</svg>`,
    'hanging-chilli': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
    <line x1="50" y1="0" x2="50" y2="190" stroke="#a08a70" stroke-width="1.5" />
    <circle cx="50" cy="190" r="4" fill="none" stroke="#d4af37" stroke-width="1.5"/>
    <defs>
        <linearGradient id="chilliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4caf50"/><stop offset="50%" stop-color="#2e7d32"/><stop offset="100%" stop-color="#1b5e20"/>
        </linearGradient>
        <linearGradient id="chilliHighlight" x1="10%" y1="10%" x2="50%" y2="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="2" dy="5" stdDeviation="4" flood-opacity="0.3"/>
        </filter>
    </defs>
    <g filter="url(#shadow)">
        <path d="M 48 194 Q 50 200 52 205 L 56 205 Q 65 240 50 295 Q 40 300 42 295 Q 40 240 45 205 Z" fill="url(#chilliGrad)"/>
        <path d="M 48 194 Q 50 200 52 205 L 56 205 Q 65 240 50 295 Q 40 300 42 295 Q 40 240 45 205 Z" fill="url(#chilliHighlight)"/>
        <!-- Cap -->
        <path d="M 42 205 Q 50 210 58 205 Q 50 195 48 194 Z" fill="#8bc34a"/>
    </g>
</svg>`,
    'hanging-lemon-chilli': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
    <line x1="50" y1="0" x2="50" y2="160" stroke="#a08a70" stroke-width="1.5" />
    <defs>
        <radialGradient id="lcGrad" cx="30%" cy="30%" r="70%"><stop offset="0%" stop-color="#fff44f"/><stop offset="100%" stop-color="#cca300"/></radialGradient>
        <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4caf50"/><stop offset="100%" stop-color="#1b5e20"/></linearGradient>
        <filter id="sh"><feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.4"/></filter>
    </defs>
    <g filter="url(#sh)">
        <!-- Rope down to chilli -->
        <line x1="50" y1="160" x2="50" y2="240" stroke="#a08a70" stroke-width="1.5"/>
        <!-- Lemon -->
        <path d="M 50 160 C 70 162 75 190 70 205 C 65 220 50 220 40 215 C 25 210 30 175 50 160 Z" fill="url(#lcGrad)"/>
        <path d="M 50 160 Q 65 150 68 165 Q 55 170 50 160" fill="#4caf50"/>
        <!-- Chilli 1 -->
        <path d="M 48 220 Q 60 240 45 270 Q 40 280 42 270 Q 40 240 45 220 Z" fill="url(#cg)"/>
        <!-- Chilli 2 -->
        <path d="M 52 230 Q 65 250 55 290 Q 50 300 52 290 Q 45 250 50 230 Z" fill="url(#cg)"/>
    </g>
</svg>`,
    'hanging-flower': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
    <line x1="50" y1="0" x2="50" y2="200" stroke="#a08a70" stroke-width="1.5" />
    <defs>
        <radialGradient id="petal" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffb3c6"/><stop offset="100%" stop-color="#ff4d6d"/></radialGradient>
        <radialGradient id="center" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffd166"/><stop offset="100%" stop-color="#f4a261"/></radialGradient>
        <filter id="sh"><feDropShadow dx="1" dy="3" stdDeviation="3" flood-opacity="0.3"/></filter>
    </defs>
    <g filter="url(#sh)">
        <path d="M 50 210 C 65 195 80 220 50 235 C 20 220 35 195 50 210" fill="url(#petal)"/>
        <path d="M 50 260 C 65 275 80 250 50 235 C 20 250 35 275 50 260" fill="url(#petal)"/>
        <path d="M 25 235 C 10 220 35 195 50 235 C 35 275 10 250 25 235" fill="url(#petal)"/>
        <path d="M 75 235 C 90 220 65 195 50 235 C 65 275 90 250 75 235" fill="url(#petal)"/>
        <circle cx="50" cy="235" r="8" fill="url(#center)"/>
    </g>
</svg>`,
    'hanging-bell': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
    <line x1="50" y1="0" x2="50" y2="200" stroke="#a08a70" stroke-width="1.5" />
    <defs>
        <linearGradient id="brass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#8a6327"/>
            <stop offset="30%" stop-color="#e6c27a"/>
            <stop offset="70%" stop-color="#c99b3b"/>
            <stop offset="100%" stop-color="#6b4c1a"/>
        </linearGradient>
        <filter id="sh"><feDropShadow dx="2" dy="5" stdDeviation="4" flood-opacity="0.5"/></filter>
    </defs>
    <g filter="url(#sh)">
        <!-- Top hook -->
        <path d="M 45 200 A 5 5 0 0 1 55 200" fill="none" stroke="url(#brass)" stroke-width="2"/>
        <!-- Bell Body -->
        <path d="M 45 205 Q 50 200 55 205 Q 65 220 70 250 L 30 250 Q 35 220 45 205 Z" fill="url(#brass)"/>
        <ellipse cx="50" cy="250" rx="20" ry="6" fill="#4a3512"/>
        <!-- Clapper -->
        <circle cx="50" cy="255" r="4" fill="url(#brass)"/>
        <!-- Detail lines -->
        <path d="M 32 245 Q 50 248 68 245" fill="none" stroke="#6b4c1a" stroke-width="1.5"/>
    </g>
</svg>`,
    'hanging-leaf': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
    <line x1="50" y1="0" x2="50" y2="190" stroke="#a08a70" stroke-width="1.5" />
    <defs>
        <linearGradient id="leaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#81c784"/><stop offset="100%" stop-color="#2e7d32"/>
        </linearGradient>
        <filter id="sh"><feDropShadow dx="1" dy="4" stdDeviation="3" flood-opacity="0.3"/></filter>
    </defs>
    <g filter="url(#sh)">
        <path d="M 50 190 Q 75 220 50 280 Q 25 220 50 190 Z" fill="url(#leaf)"/>
        <path d="M 50 190 Q 52 235 50 280" fill="none" stroke="#a5d6a7" stroke-width="1.5"/>
        <path d="M 50 220 L 60 210" fill="none" stroke="#a5d6a7" stroke-width="1"/>
        <path d="M 50 240 L 40 230" fill="none" stroke="#a5d6a7" stroke-width="1"/>
        <path d="M 50 260 L 58 250" fill="none" stroke="#a5d6a7" stroke-width="1"/>
    </g>
</svg>`,
    'hanging-star': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
    <line x1="50" y1="0" x2="50" y2="200" stroke="#a08a70" stroke-width="1.5" />
    <defs>
        <radialGradient id="star" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="50%" stop-color="#ffd700"/>
            <stop offset="100%" stop-color="#d4af37"/>
        </radialGradient>
        <filter id="sh"><feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.4"/></filter>
    </defs>
    <g filter="url(#sh)">
        <path d="M 50 205 L 56 220 L 72 220 L 59 230 L 64 245 L 50 235 L 36 245 L 41 230 L 28 220 L 44 220 Z" fill="url(#star)"/>
        <!-- Bevel lines -->
        <path d="M 50 235 L 50 205 M 50 235 L 72 220 M 50 235 L 64 245 M 50 235 L 36 245 M 50 235 L 28 220" fill="none" stroke="#ffeb3b" stroke-width="1" opacity="0.6"/>
    </g>
</svg>`,
    'hanging-cute': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
    <line x1="50" y1="0" x2="50" y2="200" stroke="#a08a70" stroke-width="1.5" />
    <defs>
        <radialGradient id="charm" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#e0e0e0"/>
        </radialGradient>
        <filter id="sh"><feDropShadow dx="2" dy="5" stdDeviation="4" flood-opacity="0.3"/></filter>
    </defs>
    <g filter="url(#sh)">
        <rect x="30" y="205" width="40" height="40" rx="15" fill="url(#charm)"/>
        <circle cx="40" cy="220" r="3" fill="#333"/>
        <circle cx="60" cy="220" r="3" fill="#333"/>
        <path d="M 45 230 Q 50 235 55 230" fill="none" stroke="#ff8a80" stroke-width="2" stroke-linecap="round"/>
        <!-- Blush -->
        <circle cx="35" cy="225" r="4" fill="#ffcdd2" opacity="0.6"/>
        <circle cx="65" cy="225" r="4" fill="#ffcdd2" opacity="0.6"/>
    </g>
</svg>`,
    'hanging-traditional': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
    <line x1="50" y1="0" x2="50" y2="190" stroke="#a08a70" stroke-width="1.5" />
    <defs>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffd700"/><stop offset="100%" stop-color="#b8860b"/>
        </linearGradient>
        <linearGradient id="red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff1744"/><stop offset="100%" stop-color="#b71c1c"/>
        </linearGradient>
        <filter id="sh"><feDropShadow dx="1" dy="4" stdDeviation="3" flood-opacity="0.4"/></filter>
    </defs>
    <g filter="url(#sh)">
        <polygon points="50,195 65,210 50,225 35,210" fill="url(#red)"/>
        <circle cx="50" cy="235" r="8" fill="url(#gold)"/>
        <polygon points="50,245 65,260 50,275 35,260" fill="url(#red)"/>
        <!-- Tassel -->
        <path d="M 50 275 L 45 295 M 50 275 L 50 300 M 50 275 L 55 295" stroke="url(#gold)" stroke-width="1.5"/>
    </g>
</svg>`,
    'hanging-minimal': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 300">
    <line x1="50" y1="0" x2="50" y2="210" stroke="#a08a70" stroke-width="1.5" />
    <defs>
        <linearGradient id="geo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#eceff1"/><stop offset="100%" stop-color="#90a4ae"/>
        </linearGradient>
        <filter id="sh"><feDropShadow dx="3" dy="5" stdDeviation="4" flood-opacity="0.2"/></filter>
    </defs>
    <g filter="url(#sh)">
        <circle cx="50" cy="215" r="5" fill="#455a64"/>
        <polygon points="50,225 70,245 50,265 30,245" fill="url(#geo)"/>
        <circle cx="50" cy="275" r="5" fill="#455a64"/>
    </g>
</svg>`
};

async function updateAssets() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB. Updating widgets...');
        
        for (const [type, svgContent] of Object.entries(realisticAssets)) {
            const base64Data = getSvgBase64(svgContent);
            
            const result = await Widget.updateMany(
                { type: type },
                { 
                    $set: { 
                        assetUrl: base64Data,
                        previewImage: base64Data 
                    } 
                }
            );
            console.log(`Updated ${type}: ${result.modifiedCount} modified.`);
        }
        
        console.log('Update complete.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updateAssets();
