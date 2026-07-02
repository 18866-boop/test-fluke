const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

if (!getApps().length) {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY
  if (privateKey) {
    privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n')
  }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    })
  })
}

const db = getFirestore();

async function processImages() {
  const publicImagesDir = path.join(process.cwd(), 'public', 'images', 'products');
  
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  console.log('Fetching products from database...');
  const productsSnap = await db.collection('products').where('category', '==', 'Keys').get();
  
  for (const doc of productsSnap.docs) {
    const data = doc.data();
    if (data.imageUrl && data.imageUrl.includes('discordapp')) {
      console.log(`Processing image for ${data.name}...`);
      try {
        let url = data.imageUrl.replace('format=webp', 'format=jpeg');
        const image = await Jimp.read(url);
        
        // Remove black background
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
          const r = this.bitmap.data[idx + 0];
          const g = this.bitmap.data[idx + 1];
          const b = this.bitmap.data[idx + 2];
          
          if (r < 25 && g < 25 && b < 25) {
            this.bitmap.data[idx + 3] = 0; // Alpha
          } else if (r < 40 && g < 40 && b < 40) {
            this.bitmap.data[idx + 3] = Math.max(0, (r+g+b) * 2);
          }
        });
        
        const fileName = `key-${doc.id}.png`;
        const localPath = path.join(publicImagesDir, fileName);
        await image.write(localPath);
        
        const newUrl = `/images/products/${fileName}`;
        await doc.ref.update({ imageUrl: newUrl });
        console.log(`Updated ${data.name} to ${newUrl}`);
      } catch (err) {
        console.error(`Failed to process ${data.name}:`, err.message);
      }
    }
  }
  console.log('Done!');
}

processImages().catch(console.error);
