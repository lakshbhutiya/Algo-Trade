

import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!serviceAccount) {
  console.warn(
    'Firebase service account key not found. Firebase Admin SDK will not be initialized.'
  );
}

const app =
  getApps().find((app) => app.name === 'admin') ||
  (serviceAccount
    ? initializeApp(
        {
          credential: credential.cert(serviceAccount),
        },
        'admin'
      )
    : undefined);

export const adminApp = app;
