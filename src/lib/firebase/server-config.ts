
import { getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

// A private cache for the Firebase Admin App instance.
let adminApp: App | null = null;

function initializeAdminApp(): App | null {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  // If the key is not available, we can't initialize.
  if (!serviceAccountString) {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin SDK could not be initialized.');
    return null;
  }
  
  // If we've already initialized, return the cached app.
  if (getApps().length > 0) {
    return getApp();
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    // Initialize the app and cache it.
    const newApp = initializeApp({
      credential: credential.cert(serviceAccount),
    });
    return newApp;
  } catch (e) {
    console.error('Failed to parse Firebase service account key or initialize app.', e);
    // Return null if initialization fails.
    return null;
  }
}

/**
 * Gets the singleton Firebase Admin App instance.
 * Initializes the app if it's not already initialized.
 * Returns null if initialization fails (e.g., missing credentials).
 */
export function getAdminApp(): App | null {
  if (!adminApp) {
    adminApp = initializeAdminApp();
  }
  return adminApp;
}
