import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

// Generic CRUD operations
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    throw error;
  }
};

export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id: docId, ...data };
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    throw error;
  }
};

export const listDocuments = async (collectionName, orderByField = 'createdAt', orderDirection = 'desc', limitCount = null) => {
  try {
    let q = collection(db, collectionName);
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    throw error;
  }
};

export const filterDocuments = async (collectionName, filters, orderByField = 'createdAt', orderDirection = 'desc') => {
  try {
    let q = collection(db, collectionName);
    
    // Apply filters
    if (filters && typeof filters === 'object') {
      Object.keys(filters).forEach(key => {
        q = query(q, where(key, '==', filters[key]));
      });
    }
    
    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    throw error;
  }
};

export const bulkCreate = async (collectionName, documents) => {
  try {
    const batch = writeBatch(db);
    const createdDocs = [];
    
    documents.forEach((docData) => {
      const docRef = doc(collection(db, collectionName));
      batch.set(docRef, {
        ...docData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      createdDocs.push({ id: docRef.id, ...docData });
    });
    
    await batch.commit();
    return createdDocs;
  } catch (error) {
    throw error;
  }
};

// Specific entity operations
export const StudentService = {
  create: (data) => createDocument('students', data),
  get: (id) => getDocument('students', id),
  update: (id, data) => updateDocument('students', id, data),
  delete: (id) => deleteDocument('students', id),
  list: (orderByField = 'updatedAt', limitCount = null) => listDocuments('students', orderByField, 'desc', limitCount),
  filter: (filters) => filterDocuments('students', filters)
};

export const ApplicationTrackerService = {
  create: (data) => createDocument('applicationTrackers', data),
  get: (id) => getDocument('applicationTrackers', id),
  update: (id, data) => updateDocument('applicationTrackers', id, data),
  delete: (id) => deleteDocument('applicationTrackers', id),
  list: (orderByField = 'updatedAt', limitCount = null) => listDocuments('applicationTrackers', orderByField, 'desc', limitCount),
  filter: (filters) => filterDocuments('applicationTrackers', filters)
};

export const EssayService = {
  create: (data) => createDocument('essays', data),
  get: (id) => getDocument('essays', id),
  update: (id, data) => updateDocument('essays', id, data),
  delete: (id) => deleteDocument('essays', id),
  list: (orderByField = 'updatedAt', limitCount = null) => listDocuments('essays', orderByField, 'desc', limitCount),
  filter: (filters) => filterDocuments('essays', filters)
};

export const ScholarshipService = {
  create: (data) => createDocument('scholarships', data),
  get: (id) => getDocument('scholarships', id),
  update: (id, data) => updateDocument('scholarships', id, data),
  delete: (id) => deleteDocument('scholarships', id),
  list: (orderByField = 'updatedAt', limitCount = null) => listDocuments('scholarships', orderByField, 'desc', limitCount),
  filter: (filters) => filterDocuments('scholarships', filters),
  bulkCreate: (documents) => bulkCreate('scholarships', documents)
};

export const SelectedCollegeService = {
  create: (data) => createDocument('selectedColleges', data),
  get: (id) => getDocument('selectedColleges', id),
  update: (id, data) => updateDocument('selectedColleges', id, data),
  delete: (id) => deleteDocument('selectedColleges', id),
  list: (orderByField = 'updatedAt', limitCount = null) => listDocuments('selectedColleges', orderByField, 'desc', limitCount),
  filter: (filters) => filterDocuments('selectedColleges', filters)
};
