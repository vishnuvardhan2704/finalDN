
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: This file is used for SERVER-SIDE operations only.
// It uses the Firebase Admin SDK, which requires service account credentials
// set in the environment variables.

try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error: any) {
  console.error('Firebase Admin initialization error:', error.message);
  // Throwing an error here is important because the app cannot function
  // without a properly configured admin SDK.
  throw new Error('Firebase Admin SDK could not be initialized. Please check your FIREBASE_SERVICE_ACCOUNT_KEY environment variable.');
}

const db = getFirestore();

export { admin, db };
