import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

async function processImages() {
  const files = fs.readdirSync(publicDir);
  
  for (const file of files) {
    if (file === 'og-image.jpg' || file === 'agrolide-png.png') {
      // Open Graph relies on jpg/png usually, just compress it heavily
      if (file === 'og-image.jpg') {
        const inputPath = path.join(publicDir, file);
        const tempPath = path.join(publicDir, 'temp-og.jpg');
        await sharp(inputPath).jpeg({ quality: 60 }).toFile(tempPath);
        fs.renameSync(tempPath, inputPath);
        console.log(`Compressed og-image.jpg`);
      }
      continue;
    }
    
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
      const inputPath = path.join(publicDir, file);
      const name = path.parse(file).name;
      const outputPath = path.join(publicDir, `${name}.webp`);
      
      console.log(`Processing ${file}...`);
      
      await sharp(inputPath)
        .webp({ quality: 75 })
        .toFile(outputPath);
        
      // Supprimer l'original
      fs.unlinkSync(inputPath);
      console.log(`Saved as ${name}.webp and removed original.`);
    }
  }
}

processImages().catch(console.error);
