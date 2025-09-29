
import { getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

/**
 * Gets the singleton Firebase Admin App instance.
 * Initializes the app if it's not already initialized.
 * Returns null if initialization fails (e.g., missing credentials).
 */
export function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApp();
  }

  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountString) {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin SDK could not be initialized.');
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    return initializeApp({
      credential: credential.cert(serviceAccount),
    });
  } catch (e) {
    console.error('Failed to parse Firebase service account key or initialize app.', e);
    return null;
  }
}
