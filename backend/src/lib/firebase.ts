import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';
import { env } from '../config/env.js';

if (!admin.apps.length) {
  const keyPath = env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? path.resolve(env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : null;

  admin.initializeApp({
    projectId: env.FIREBASE_PROJECT_ID,
    credential: keyPath
      ? admin.credential.cert(JSON.parse(readFileSync(keyPath, 'utf8')))
      : admin.credential.applicationDefault(),
  });
}

export const firebaseAdmin = admin;