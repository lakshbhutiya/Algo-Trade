
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let adminApp;

if (!getApps().length) {
  if (serviceAccountString) {
    try {
      const serviceAccount = JSON.parse(serviceAccountString);
      adminApp = initializeApp({
        credential: credential.cert(serviceAccount),
      });
    } catch (e) {
      console.error('Failed to parse Firebase service account key.', e);
    }
  } else {
    console.warn(
      'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin SDK will not be initialized.'
    );
  }
} else {
  adminApp = getApp();
}

export { adminApp };
