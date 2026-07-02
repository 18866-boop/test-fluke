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

async function main() {
  // 1. Fix Rank Prices
  console.log('Fixing Rank prices...')
  const rankPrices = {
    'VIP': 150,
    'VIP+': 300,
    'MVP': 550,
    'MVP+': 750,
    'PREMIUM': 1000,
    'SUPREME': 1500,
    'SUPERIOR': 5000
  }

  const productsSnap = await db.collection('products').where('category', '==', 'Ranks').get()
  
  for (const doc of productsSnap.docs) {
    const data = doc.data()
    const correctPrice = rankPrices[data.name] || rankPrices[data.name.replace(' (ถาวร)', '')] || rankPrices[data.name.trim()]
    if (correctPrice) {
      await doc.ref.update({ price: correctPrice })
      console.log(`Updated ${data.name} price to ${correctPrice}`)
    }
  }

  // 2. Add Keys
  console.log('Adding Keys...')
  const keys = [
    {
      name: 'Common Key x2',
      description: 'กุญแจระดับ Common จำนวน 2 ดอก',
      category: 'Keys',
      price: 10,
      imageUrl: 'https://media.discordapp.net/attachments/1499102778356662290/1522090685505863690/1000435079-removebg-preview.jpg?ex=6a4734ea&is=6a45e36a&hm=47c7972fcd18d5f3be7723cb5dde09eb8f1059febbc0e14e5080441bc95a743f&=&format=webp&width=1354&height=738',
      command: 'crate key give {player} common 2'
    },
    {
      name: 'Rare Key x4',
      description: 'กุญแจระดับ Rare จำนวน 4 ดอก',
      category: 'Keys',
      price: 20,
      imageUrl: 'https://media.discordapp.net/attachments/1499102778356662290/1522090685811921016/1000435080-removebg-preview.jpg?ex=6a4734ea&is=6a45e36a&hm=312d93426f6c0e797a8fd5d53b8736d4e9ffe291d41d6561062eeced48340c74&=&format=webp&width=1354&height=738',
      command: 'crate key give {player} rare 4'
    },
    {
      name: 'Epic Key x6',
      description: 'กุญแจระดับ Epic จำนวน 6 ดอก',
      category: 'Keys',
      price: 30,
      imageUrl: 'https://media.discordapp.net/attachments/1499102778356662290/1522090686080618536/1000435082-removebg-preview.jpg?ex=6a4734ea&is=6a45e36a&hm=8ee052d29fd904d64f826ebd2cd5f12d4ff6d20ccfc100886e47dbd9367865c9&=&format=webp&width=1354&height=738',
      command: 'crate key give {player} epic 6'
    },
    {
      name: 'Legendary Key x8',
      description: 'กุญแจระดับ Legendary จำนวน 8 ดอก',
      category: 'Keys',
      price: 40,
      imageUrl: 'https://media.discordapp.net/attachments/1499102778356662290/1522090686529273986/1000435083-removebg-preview.jpg?ex=6a4734ea&is=6a45e36a&hm=6d547e467ebb71c69fbea6e0fb86c36d9bc05958897359d3938de3a944a24aaf&=&format=webp&width=1354&height=738',
      command: 'crate key give {player} legendary 8'
    },
    {
      name: 'Mythic Key x2',
      description: 'กุญแจระดับ Mythic จำนวน 2 ดอก',
      category: 'Keys',
      price: 50,
      imageUrl: 'https://media.discordapp.net/attachments/1499102778356662290/1522090686961287218/1000435084-removebg-preview.jpg?ex=6a4734ea&is=6a45e36a&hm=690cf1a3eda59c81f4350c409f1d5c741f44e2e0be5e701fb39025393f8cf33a&=&format=webp&width=1354&height=738',
      command: 'crate key give {player} mythic 2'
    },
    {
      name: 'Ultimate Key x2',
      description: 'กุญแจระดับ Ultimate จำนวน 2 ดอก',
      category: 'Keys',
      price: 100,
      imageUrl: 'https://media.discordapp.net/attachments/1499102778356662290/1522090687263150249/1000435085-removebg-preview.jpg?ex=6a4734ea&is=6a45e36a&hm=3c15ad3209e1923e012342a9a3306c4e6a3a50641e8dc21ff2951e29da41801e&=&format=webp&width=1354&height=738',
      command: 'crate key give {player} ultimate 2'
    }
  ]

  for (const key of keys) {
    // Check if exists first to avoid duplicates
    const existSnap = await db.collection('products').where('name', '==', key.name).get()
    if (existSnap.empty) {
      await db.collection('products').add({
        ...key,
        createdAt: FieldValue.serverTimestamp()
      })
      console.log(`Added ${key.name}`)
    } else {
      console.log(`${key.name} already exists.`)
    }
  }

  console.log('Done!')
}

main().catch(console.error)
