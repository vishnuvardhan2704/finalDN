
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: This file is used for SERVER-SIDE operations only.
// It uses the Firebase Admin SDK, which requires service account credentials
// set in the environment variables.

let db: any = null;

function buildServiceAccountFromEnv(): admin.ServiceAccount | null {
  const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (rawKey && rawKey.trim().length > 0) {
    // Try direct JSON
    try {
      return JSON.parse(rawKey) as admin.ServiceAccount;
    } catch (_) {
      // Try base64-encoded JSON
      try {
        const decoded = Buffer.from(rawKey, 'base64').toString('utf8');
        return JSON.parse(decoded) as admin.ServiceAccount;
      } catch (_) {
        // Try to normalize single quotes and escaped newlines
        try {
          const normalized = rawKey
            .replace(/^'+|'+$/g, '')
            .replace(/\n/g, '\n')
            .replace(/\r/g, '');
          return JSON.parse(normalized) as admin.ServiceAccount;
        } catch (err) {
          console.error('FIREBASE_SERVICE_ACCOUNT_KEY is set but could not be parsed as JSON or base64 JSON.');
        }
      }
    }
  }

  // Fallback to discrete env vars
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    // Replace \n sequences with actual newlines
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    return {
      projectId,
      clientEmail,
      privateKey,
    } as unknown as admin.ServiceAccount;
  }

  return null;
}

try {
  if (!admin.apps.length) {
    const serviceAccount = buildServiceAccountFromEnv();

    if (!serviceAccount) {
      console.warn('⚠️  Firebase Admin credentials not configured.');
      console.warn('   Set FIREBASE_SERVICE_ACCOUNT_KEY (JSON or base64 JSON), or');
      console.warn('   set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.');

      // Create a mock db object for development to avoid hard crashes
      db = {
        collection: () => ({
          doc: () => ({
            get: async () => ({ exists: false, data: () => null, id: '' }),
          }),
          where: () => ({
            get: async () => ({ docs: [] }),
          }),
          get: async () => ({ docs: [] }),
        }),
      };
    } else {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      db = getFirestore();
    }
  } else {
    db = getFirestore();
  }
} catch (error: any) {
  console.error('Firebase Admin initialization error:', error?.message || error);
  console.error('Please check your FIREBASE_SERVICE_ACCOUNT_KEY or discrete Firebase env variables.');

  // Create a mock db object for development
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null, id: '' }),
      }),
      where: () => ({
        get: async () => ({ docs: [] }),
      }),
      get: async () => ({ docs: [] }),
    }),
  };
}

export { admin, db };
