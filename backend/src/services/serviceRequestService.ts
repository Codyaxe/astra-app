import { firebaseAdmin } from '../lib/firebase.js';

const db = firebaseAdmin.firestore();
const { FieldValue } = firebaseAdmin.firestore;

export async function createServiceRequest(input: Record<string, unknown>) {
  const year = new Date().getFullYear();
  const counterRef = db.collection('counters').doc(`serviceRequests-${year}`);
  const requestRef = db.collection('serviceRequests').doc();

  const referenceNumber = await db.runTransaction(async (tx) => {
    const snap = await tx.get(counterRef);
    const next = (snap.exists ? (snap.data()!.value as number) : 0) + 1;
    const ref = `ASC-${year}-${String(next).padStart(6, '0')}`;

    tx.set(counterRef, { value: next });
    tx.set(requestRef, {
      ...input,
      referenceNumber: ref,
      status: 'pending',
      submissionSource: 'website',
      submittedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return ref;
  });

  return { id: requestRef.id, referenceNumber };
}
