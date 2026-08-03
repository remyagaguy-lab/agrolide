const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function resizeIcons() {
  const inputImage = path.join(__dirname, '..', 'agrolide-png.png');
  const outputDir = path.join(__dirname, 'public', 'icons');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    await sharp(inputImage)
      .resize(192, 192)
      .toFile(path.join(outputDir, 'icon-192.png'));
    console.log('Created icon-192.png');

    await sharp(inputImage)
      .resize(512, 512)
      .toFile(path.join(outputDir, 'icon-512.png'));
    console.log('Created icon-512.png');
  } catch (error) {
    console.error('Error resizing images:', error);
  }
}

resizeIcons();
