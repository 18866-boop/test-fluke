const { loadEnvConfig } = require('@next/env')
loadEnvConfig(process.cwd())

const { initializeApp, cert, getApps } = require('firebase-admin/app')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')

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

const db = getFirestore()

async function updateSupportRanks() {
  try {
    const productsRef = db.collection('products');
    
    // 1. Add 'Support' rank
    await productsRef.add({
      name: 'Support',
      description: 'ได้รับเมื่อสนับสนุนครบ 5,000+ THB',
      price: 5000.00,
      category: 'Ranks',
      imageUrl: 'https://cdn.discordapp.com/attachments/1499102778356662290/1522103123856986264/1000435106-removebg-preview.jpg?ex=6a474080&is=6a45ef00&hm=d381dc8c3fb61f26eef3bb7a95702f76a33bd94803d1d4d5527374b4bc2522cf&',
      command: 'lp user {player} parent add support',
      createdAt: FieldValue.serverTimestamp()
    });
    console.log('Added Support rank');

    // 2. Update 'Superior' rank
    const snapshot = await productsRef.where('name', 'in', ['Superior', 'SUPERIOR', 'superior']).get();
    if (!snapshot.empty) {
      for (const doc of snapshot.docs) {
        await doc.ref.update({
          price: 10000.00,
          description: 'ได้รับเมื่อสนับสนุนครบ 10,000+ THB'
        });
        console.log(`Updated ${doc.data().name} rank to 10000 THB`);
      }
    } else {
      console.log('Superior rank not found, adding it...');
      await productsRef.add({
        name: 'SUPERIOR',
        description: 'ได้รับเมื่อสนับสนุนครบ 10,000+ THB',
        price: 10000.00,
        category: 'Ranks',
        imageUrl: '', 
        command: 'lp user {player} parent add superior',
        createdAt: FieldValue.serverTimestamp()
      });
    }

    console.log('Update complete!');
  } catch (error) {
    console.error('Error updating:', error);
  }
}

updateSupportRanks();
