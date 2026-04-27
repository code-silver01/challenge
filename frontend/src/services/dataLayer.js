/**
 * Data Access Layer — All Firestore interactions centralized here.
 * No raw SDK calls in UI components.
 */
import { db } from './firebase';
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove,
  collection, addDoc, query, where, getDocs, orderBy, limit, serverTimestamp
} from 'firebase/firestore';

// ─── User Profile ──────────────────────────
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(uid, profile) {
  await setDoc(doc(db, 'users', uid), {
    ...profile,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ─── Purchase History ──────────────────────
export async function addPurchaseHistory(uid, cartItems) {
  await addDoc(collection(db, 'users', uid, 'purchases'), {
    items: cartItems,
    createdAt: serverTimestamp(),
  });
}

export async function getPurchaseHistory(uid, maxCount = 10) {
  const q = query(
    collection(db, 'users', uid, 'purchases'),
    orderBy('createdAt', 'desc'),
    limit(maxCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── Never Suggest List ────────────────────
export async function addToNeverSuggest(uid, itemName) {
  await updateDoc(doc(db, 'users', uid), {
    neverSuggest: arrayUnion(itemName.toLowerCase()),
  });
}

export async function removeFromNeverSuggest(uid, itemName) {
  await updateDoc(doc(db, 'users', uid), {
    neverSuggest: arrayRemove(itemName.toLowerCase()),
  });
}

// ─── Suggestion Feedback ───────────────────
export async function saveSuggestionFeedback(uid, suggestion, liked) {
  await addDoc(collection(db, 'users', uid, 'feedback'), {
    suggestion,
    liked,
    createdAt: serverTimestamp(),
  });
}
