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
} from 'firebase/firestore';

import { db } from '../config/firebase';

// Collection name - you can change this to match your database structure
const COLLECTION_NAME = 'items';

// Search functionality for all users
export const searchItems = async searchTerm => {
  try {
    const itemsRef = collection(db, COLLECTION_NAME);
    let q;

    if (searchTerm.trim() === '') {
      // If no search term, get all items
      q = query(itemsRef, orderBy('createdAt', 'desc'), limit(50));
    } else {
      // Search by name field (you can modify this based on your data structure)
      q = query(
        itemsRef,
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        orderBy('name'),
        limit(50)
      );
    }

    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach(doc => {
      items.push({ id: doc.id, ...doc.data() });
    });

    return items;
  } catch (error) {
    console.error('Error searching items:', error);
    throw error;
  }
};

// Admin functionality - get all items
export const getAllItems = async () => {
  try {
    const itemsRef = collection(db, COLLECTION_NAME);
    const q = query(itemsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const items = [];
    querySnapshot.forEach(doc => {
      items.push({ id: doc.id, ...doc.data() });
    });

    return items;
  } catch (error) {
    console.error('Error getting all items:', error);
    throw error;
  }
};

// Admin functionality - add new item
export const addItem = async itemData => {
  try {
    const itemsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(itemsRef, {
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { id: docRef.id, ...itemData };
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

// Admin functionality - update item
export const updateItem = async (itemId, itemData) => {
  try {
    const itemRef = doc(db, COLLECTION_NAME, itemId);
    await updateDoc(itemRef, {
      ...itemData,
      updatedAt: new Date(),
    });

    return { id: itemId, ...itemData };
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

// Admin functionality - delete item
export const deleteItem = async itemId => {
  try {
    const itemRef = doc(db, COLLECTION_NAME, itemId);
    await deleteDoc(itemRef);
    return itemId;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// Get single item by ID
export const getItemById = async itemId => {
  try {
    const itemRef = doc(db, COLLECTION_NAME, itemId);
    const docSnap = await getDoc(itemRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    console.error('Error getting item:', error);
    throw error;
  }
};
