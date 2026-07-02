import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY
    if (privateKey) {
      privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n')
    }
    
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        })
      })
    } else {
      // Fallback for build time
      initializeApp()
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack)
  }
}

export const db = getFirestore()
