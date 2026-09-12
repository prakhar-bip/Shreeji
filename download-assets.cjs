const fs = require('fs');
const path = require('path');
const https = require('https');

const assetsDir = path.join(__dirname, 'src', 'assets');
const files = fs.readdirSync(assetsDir);

async function downloadAsset(assetPath) {
    const content = JSON.parse(fs.readFileSync(assetPath, 'utf8'));
    const projectId = content.project_id;
    const assetId = content.asset_id;
    const filename = content.original_filename;
    
    const url = `https://${projectId}.lovableproject.com/__l5e/assets-v1/${assetId}/${filename}`;
    const destPath = path.join(assetsDir, filename);
    
    return new Promise((resolve, reject) => {
        console.log(`Downloading ${filename} from ${url}...`);
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.error(`Failed to download ${filename}. Status: ${res.statusCode}`);
                resolve(false);
                return;
            }
            const file = fs.createWriteStream(destPath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Saved ${filename}`);
                resolve(true);
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => {});
            console.error(`Error downloading ${filename}: ${err.message}`);
            resolve(false);
        });
    });
}

async function main() {
    const assetJsonFiles = files.filter(f => f.endsWith('.asset.json'));
    console.log(`Found ${assetJsonFiles.length} asset JSON files.`);
    
    for (const file of assetJsonFiles) {
        const fullPath = path.join(assetsDir, file);
        const success = await downloadAsset(fullPath);
        if (success) {
            fs.unlinkSync(fullPath);
        }
    }
}

main();
