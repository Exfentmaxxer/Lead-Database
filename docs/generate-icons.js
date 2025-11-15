#!/usr/bin/env node

/**
 * Simple PWA Icon Generator
 * Creates basic placeholder icons for the PWA
 * For production, replace with actual branded icons
 */

const fs = require('fs');
const path = require('path');

// SVG templates for icons
const createSVG = (size, text) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#gradient)"/>

  <!-- Icon content -->
  <text
    x="50%"
    y="50%"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    font-size="${size * 0.4}"
    font-weight="bold"
    fill="#ffffff"
  >${text}</text>

  <!-- Clipboard decoration -->
  <rect x="${size * 0.25}" y="${size * 0.15}" width="${size * 0.5}" height="${size * 0.7}"
        rx="${size * 0.05}" fill="none" stroke="#ffffff" stroke-width="${size * 0.03}"/>
  <rect x="${size * 0.35}" y="${size * 0.05}" width="${size * 0.3}" height="${size * 0.15}"
        rx="${size * 0.03}" fill="#ffffff" stroke="#1a1a2e" stroke-width="${size * 0.01}"/>
</svg>`;

const icons = [
  { size: 192, filename: 'icon-192.png' },
  { size: 512, filename: 'icon-512.png' }
];

console.log('🎨 PWA Icon Generator\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check if we're in the right directory
const frontendDir = path.join(__dirname, '../frontend');
if (!fs.existsSync(frontendDir)) {
  console.error('❌ Frontend directory not found!');
  console.error('   Please run this script from the project root directory.\n');
  process.exit(1);
}

// Generate SVG icons
console.log('Generating SVG icons...\n');

icons.forEach(({ size, filename }) => {
  const svgContent = createSVG(size, '📋');
  const svgPath = path.join(frontendDir, filename.replace('.png', '.svg'));

  try {
    fs.writeFileSync(svgPath, svgContent);
    console.log(`✓ Created ${filename.replace('.png', '.svg')} (${size}x${size})`);
  } catch (error) {
    console.error(`✗ Failed to create ${filename.replace('.png', '.svg')}:`, error.message);
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('✅ Icon generation complete!\n');
console.log('📝 Note: SVG icons created. For best results:\n');
console.log('   1. Use a tool like Figma or Illustrator to create branded icons');
console.log('   2. Export as PNG at 192x192 and 512x512');
console.log('   3. Or convert SVG to PNG using:');
console.log('      - Online: https://cloudconvert.com/svg-to-png');
console.log('      - ImageMagick: convert icon.svg icon.png');
console.log('      - Inkscape: inkscape icon.svg --export-png=icon.png\n');
console.log('   Replace the generated SVG files in frontend/ with your PNGs.\n');

// Check if ImageMagick is available
const { execSync } = require('child_process');
let hasImageMagick = false;

try {
  execSync('convert -version', { stdio: 'ignore' });
  hasImageMagick = true;
} catch (e) {
  // ImageMagick not available
}

if (hasImageMagick) {
  console.log('🎉 ImageMagick detected! Converting to PNG...\n');

  icons.forEach(({ size, filename }) => {
    const svgPath = path.join(frontendDir, filename.replace('.png', '.svg'));
    const pngPath = path.join(frontendDir, filename);

    try {
      execSync(`convert -background none "${svgPath}" -resize ${size}x${size} "${pngPath}"`, { stdio: 'ignore' });
      console.log(`✓ Converted to ${filename}`);
      // Remove SVG after successful conversion
      fs.unlinkSync(svgPath);
    } catch (error) {
      console.error(`✗ Failed to convert ${filename}:`, error.message);
    }
  });

  console.log('\n✅ PNG conversion complete!\n');
} else {
  console.log('💡 Tip: Install ImageMagick for automatic PNG conversion:');
  console.log('   - Mac: brew install imagemagick');
  console.log('   - Ubuntu: sudo apt-get install imagemagick');
  console.log('   - Windows: https://imagemagick.org/script/download.php\n');
}

console.log('🚀 Your PWA is ready to deploy!\n');
