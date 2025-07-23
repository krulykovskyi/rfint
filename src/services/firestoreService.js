import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../config/firebase';

const COLLECTION_NAME = 'signals';

export const searchSignals = async params => {
  const { name = '', minFreq, maxFreq, type } = params;
  try {
    const signalsRef = collection(db, COLLECTION_NAME);
    const conditions = [];

    if (name.trim()) {
      conditions.push(
        where('name', '>=', name),
        where('name', '<=', name + '\uf8ff')
      );
      conditions.push(orderBy('name'));
    }
    if (minFreq !== undefined && minFreq !== '') {
      conditions.push(where('minFreq', '>=', Number(minFreq)));
    }
    if (maxFreq !== undefined && maxFreq !== '') {
      conditions.push(where('maxFreq', '<=', Number(maxFreq)));
    }
    if (type) {
      conditions.push(where('type', '==', type));
    }

    const q = query(signalsRef, ...conditions, limit(50));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach(d => items.push({ id: d.id, ...d.data() }));
    return items;
  } catch (error) {
    console.error('Error searching signals:', error);
    throw error;
  }
};

export const getAllSignals = async () => {
  try {
    const signalsRef = collection(db, COLLECTION_NAME);
    const q = query(signalsRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach(d => items.push({ id: d.id, ...d.data() }));
    return items;
  } catch (error) {
    console.error('Error getting signals:', error);
    throw error;
  }
};

export const addSignal = async (data, uid) => {
  try {
    const ref = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(ref, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: uid,
      updatedBy: uid,
    });
    const snap = await getDoc(docRef);
    return { id: docRef.id, ...snap.data() };
  } catch (error) {
    console.error('Error adding signal:', error);
    throw error;
  }
};

export const updateSignal = async (id, data, uid) => {
  try {
    const ref = doc(db, COLLECTION_NAME, id);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });
    const snap = await getDoc(ref);
    return { id, ...snap.data() };
  } catch (error) {
    console.error('Error updating signal:', error);
    throw error;
  }
};

export const deleteSignal = async id => {
  try {
    const ref = doc(db, COLLECTION_NAME, id);
    await deleteDoc(ref);
    return id;
  } catch (error) {
    console.error('Error deleting signal:', error);
    throw error;
  }
};

export const getSignalById = async id => {
  try {
    const ref = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new Error('Signal not found');
    }
    return { id, ...snap.data() };
  } catch (error) {
    console.error('Error getting signal:', error);
    throw error;
  }
};
