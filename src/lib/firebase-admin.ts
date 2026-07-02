import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let dbInstance: FirebaseFirestore.Firestore | null = null;

try {
  if (!getApps().length) {
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
      // Fallback for build time or missing credentials
      initializeApp()
    }
  }
  dbInstance = getFirestore()
} catch (error: any) {
  console.error('Firebase admin initialization error:', error.stack)
  // We don't crash here so the page can load and we can catch the error dynamically
  // dbInstance will remain null, and any attempt to use it will throw, which CAN be caught by our try-catch in page.tsx!
}

// Create a proxy that throws a readable error when db is used but failed to initialize
export const db = new Proxy({} as FirebaseFirestore.Firestore, {
  get: (target, prop) => {
    if (!dbInstance) {
      throw new Error("Firebase Admin is not properly initialized. Please check your Vercel Environment Variables (FIREBASE_PRIVATE_KEY formatting).")
    }
    return (dbInstance as any)[prop]
  }
})
