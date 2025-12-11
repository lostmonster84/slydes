#!/usr/bin/env node

/**
 * SLYDES ICON GENERATOR
 * Generates all required favicon and app icons from logo.svg
 * Run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('📦 Installing sharp for image generation...');
  console.log('Run: npm install --save-dev sharp');
  console.log('Then run this script again.');
  process.exit(1);
}

const inputSVG = path.join(__dirname, '../public/logo.svg');
const outputDir = path.join(__dirname, '../public');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateIcons() {
  console.log('🎨 Generating icons from logo.svg...\n');

  try {
    // Generate PNG files
    for (const { name, size } of sizes) {
      await sharp(inputSVG)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, name));
      console.log(`✅ Generated ${name} (${size}x${size})`);
    }

    // Generate favicon.ico (32x32)
    await sharp(inputSVG)
      .resize(32, 32)
      .toFile(path.join(outputDir, 'favicon.ico'));
    console.log('✅ Generated favicon.ico (32x32)');

    // Generate OG image (1200x630) with logo centered on gradient background
    const logoSize = 400;
    const ogWidth = 1200;
    const ogHeight = 630;
    
    // Create gradient background SVG
    const ogSvg = `
      <svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0A0E27;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a1f3a;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${ogWidth}" height="${ogHeight}" fill="url(#bg-gradient)"/>
      </svg>
    `;

    // Create background
    const background = await sharp(Buffer.from(ogSvg))
      .png()
      .toBuffer();

    // Resize logo
    const logo = await sharp(inputSVG)
      .resize(logoSize, logoSize)
      .png()
      .toBuffer();

    // Composite logo on background (centered)
    await sharp(background)
      .composite([{
        input: logo,
        top: Math.floor((ogHeight - logoSize) / 2),
        left: Math.floor((ogWidth - logoSize) / 2),
      }])
      .png()
      .toFile(path.join(outputDir, 'og-image.png'));
    console.log('✅ Generated og-image.png (1200x630)');

    console.log('\n🔥 ALL ICONS GENERATED SUCCESSFULLY!\n');
    console.log('Files created in /public:');
    console.log('  - favicon.ico');
    console.log('  - favicon.svg (already exists)');
    console.log('  - favicon-16x16.png');
    console.log('  - favicon-32x32.png');
    console.log('  - apple-touch-icon.png');
    console.log('  - android-chrome-192x192.png');
    console.log('  - android-chrome-512x512.png');
    console.log('  - og-image.png');
    console.log('\n✨ Ready to deploy!');

  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();



