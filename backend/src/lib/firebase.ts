import admin from 'firebase-admin';
import { env } from '../config/env.js';

// Initialize Firebase Admin SDK once from environment configuration
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: env.FIREBASE_PROJECT_ID,
  });
}

// TODO(Cloud): Configure production service account credentials / ADC
export const firebaseAdmin = admin;
