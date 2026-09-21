import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use sharp from imagit backend
import sharp from 'file:///c:/Users/manua/OneDrive/Documents/Repos/imagit/backend/node_modules/sharp/lib/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'public', 'assets');

async function processDirectory(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      const ext = path.extname(entry.name);
      const baseName = path.basename(entry.name, ext);
      const outputPath = path.join(dir, `${baseName}.webp`);
      
      console.log(`Optimizing: ${entry.name} -> ${baseName}.webp`);
      const originalStat = await fs.promises.stat(fullPath);
      
      // Convert to WebP with 82 quality and high effort (matching squoosh libwebp presets)
      await sharp(fullPath)
        .webp({ quality: 82, effort: 6 })
        .toFile(outputPath);
      
      const newStat = await fs.promises.stat(outputPath);
      const savedPercent = (((originalStat.size - newStat.size) / originalStat.size) * 100).toFixed(1);
      console.log(`  Original: ${(originalStat.size / 1024).toFixed(1)} KB -> WebP: ${(newStat.size / 1024).toFixed(1)} KB (-${savedPercent}%)`);
      
      // Remove original format as requested: "Si son png u otro formato descartalas una vez optimizadas"
      await fs.promises.unlink(fullPath);
      console.log(`  Deleted original: ${entry.name}`);
    }
  }
}

async function main() {
  console.log('--- Starting WebP Optimization ---');
  await processDirectory(assetsDir);
  console.log('--- WebP Optimization Complete ---');
}

main().catch(err => {
  console.error('Optimization error:', err);
  process.exit(1);
});
