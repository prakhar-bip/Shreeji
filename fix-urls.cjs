const fs = require('fs');
const path = require('path');

const namesToReplace = [
    'shreeLogoAsset', 'asianPaintsLogoAsset', 'shopFrontAsset', 
    'plywoodAsset', 'hardwareAsset', 'colorsAsset', 'fevicolSh',
    'exteriorAsset', 'paintInteriorAsset', 'hardwareInteriorAsset', 
    'commercialPlywood', 'waterproofPlywood', 'mdfBoard', 'woodgrainLaminate',
    'glossLaminate', 'matteLaminate', 'softCloseHinge', 'drawerChannel',
    'paintTerracotta', 'paintOlive', 'paintSand', 'wallPutty',
    'woodAdhesive', 'contactAdhesive', 'cabinetHandles', 'knobsHooks',
    'asianPaintsLogo', 'colorsImage', 'materialsImage', 'interiorAsset'
];

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const name of namesToReplace) {
                const regex = new RegExp(`\\b${name}\\.url\\b`, 'g');
                if (regex.test(content)) {
                    content = content.replace(regex, name);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
