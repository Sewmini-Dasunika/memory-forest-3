// Firebase Configuration & Integration for Memory Forest
// Complete backend setup with Firestore, Authentication, Storage

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
  writeBatch
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from "firebase/storage";

// Firebase Configuration
// ⚠️ Replace with YOUR Firebase project config from console.firebase.google.com
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDfL9x1K_2h3K4l5m6n7o8p9q0r1s2t3u4v",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "memory-forest-1234.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "memory-forest-1234",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "memory-forest-1234.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789012:web:abc123def456ghi789jkl"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ==================== AUTHENTICATION FUNCTIONS ====================

export async function registerUser(email, password, displayName, dateOfBirth) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, {
      displayName: displayName
    });

    // Create user document in Firestore
    const usersRef = collection(db, "users");
    await addDoc(usersRef, {
      uid: user.uid,
      email: email,
      displayName: displayName,
      dateOfBirth: dateOfBirth,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      profileImage: "",
      bio: "",
      
      // Tree stats
      treeAge: calculateAge(dateOfBirth),
      memoryCount: 0,
      treeHealth: 100,
      
      // Social
      connections: [],
      connectionRequests: [],
      followers: 0,
      following: 0,
      
      // Preferences
      theme: "dark",
      privacy: "public",
      notifications: true
    });

    // Initialize user subcollections
    await initializeUserCollections(user.uid);

    console.log("✅ User registered successfully!");
    return user;
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ User logged in successfully!");
    return userCredential.user;
  } catch (error) {
    console.error("❌ Login error:", error.message);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    console.log("✅ User logged out successfully!");
  } catch (error) {
    console.error("❌ Logout error:", error.message);
    throw error;
  }
}

export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("✅ User authenticated:", user.uid);
    } else {
      console.log("⚠️ No user authenticated");
    }
    callback(user);
  });
}

// ==================== USER PROFILE FUNCTIONS ====================

export async function getUserProfile(userId) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.size > 0) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error("❌ Error getting user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(userId, updates) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    });
    
    console.log("✅ Profile updated");
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw error;
  }
}

// ==================== MEMORY FUNCTIONS ====================

export async function addMemory(userId, memoryData) {
  try {
    const memoriesRef = collection(db, `users/${userId}/memories`);
    
    const docRef = await addDoc(memoriesRef, {
      ...memoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      comments: [],
      shares: 0,
      taggedUsers: memoryData.taggedUsers || [],
      imageUrls: memoryData.imageUrls || [],
      videoUrl: memoryData.videoUrl || ""
    });

    // Update user memory count
    await updateUserMemoryCount(userId, 1);

    // Notify tagged users
    if (memoryData.taggedUsers && memoryData.taggedUsers.length > 0) {
      await notifyTaggedUsers(userId, memoryData.taggedUsers, memoryData.title);
    }

    console.log("✅ Memory added:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding memory:", error);
    throw error;
  }
}

export function getMemoriesRealtime(userId, callback) {
  try {
    const q = query(
      collection(db, `users/${userId}/memories`),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (snapshot) => {
      const memories = [];
      snapshot.forEach((doc) => {
        memories.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(memories);
    });
  } catch (error) {
    console.error("❌ Error getting memories:", error);
    throw error;
  }
}

export async function updateMemory(userId, memoryId, updates) {
  try {
    const memoryRef = doc(db, `users/${userId}/memories`, memoryId);
    await updateDoc(memoryRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log("✅ Memory updated");
  } catch (error) {
    console.error("❌ Error updating memory:", error);
    throw error;
  }
}

export async function deleteMemory(userId, memoryId) {
  try {
    await deleteDoc(doc(db, `users/${userId}/memories`, memoryId));
    await updateUserMemoryCount(userId, -1);
    console.log("✅ Memory deleted");
  } catch (error) {
    console.error("❌ Error deleting memory:", error);
    throw error;
  }
}

// ==================== CONNECTION FUNCTIONS ====================

export async function sendConnectionRequest(fromUserId, toUserId, category) {
  try {
    const connectionsRef = collection(db, "connections");
    
    const docRef = await addDoc(connectionsRef, {
      from: fromUserId,
      to: toUserId,
      category: category,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Send notification to target user
    await addNotification(toUserId, {
      type: "connection_request",
      message: `New connection request`,
      fromUserId: fromUserId,
      category: category,
      read: false
    });

    console.log("✅ Connection request sent");
    return docRef.id;
  } catch (error) {
    console.error("❌ Error sending connection request:", error);
    throw error;
  }
}

export async function acceptConnectionRequest(connectionId, userId) {
  try {
    const connectionRef = doc(db, "connections", connectionId);
    
    await updateDoc(connectionRef, {
      status: "accepted",
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log("✅ Connection request accepted");
  } catch (error) {
    console.error("❌ Error accepting connection:", error);
    throw error;
  }
}

export function getUserConnections(userId, callback) {
  try {
    const q = query(
      collection(db, "connections"),
      where("from", "==", userId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const connections = [];
      snapshot.forEach((doc) => {
        connections.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(connections);
    });
  } catch (error) {
    console.error("❌ Error getting connections:", error);
    throw error;
  }
}

// ==================== NOTIFICATION FUNCTIONS ====================

export async function addNotification(userId, notificationData) {
  try {
    const notificationsRef = collection(db, `users/${userId}/notifications`);
    
    const docRef = await addDoc(notificationsRef, {
      ...notificationData,
      createdAt: serverTimestamp(),
      read: false
    });

    console.log("✅ Notification added");
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding notification:", error);
    throw error;
  }
}

export function getNotificationsRealtime(userId, callback) {
  try {
    const q = query(
      collection(db, `users/${userId}/notifications`),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (snapshot) => {
      const notifications = [];
      snapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(notifications);
    });
  } catch (error) {
    console.error("❌ Error getting notifications:", error);
    throw error;
  }
}

export async function markNotificationAsRead(userId, notificationId) {
  try {
    const notifRef = doc(db, `users/${userId}/notifications`, notificationId);
    await updateDoc(notifRef, { read: true });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    throw error;
  }
}

// ==================== STORAGE FUNCTIONS ====================

export async function uploadMemoryImage(userId, file) {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const fileRef = ref(storage, `users/${userId}/memories/${fileName}`);
    
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    
    console.log("✅ Image uploaded");
    return url;
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    throw error;
  }
}

export async function uploadProfileImage(userId, file) {
  try {
    const fileRef = ref(storage, `users/${userId}/profile/${file.name}`);
    
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    
    // Update user profile
    await updateUserProfile(userId, { profileImage: url });
    
    console.log("✅ Profile image uploaded");
    return url;
  } catch (error) {
    console.error("❌ Error uploading profile image:", error);
    throw error;
  }
}

// ==================== HELPER FUNCTIONS ====================

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

async function initializeUserCollections(userId) {
  try {
    // Create memories subcollection
    const memoriesRef = collection(db, `users/${userId}/memories`);
    await addDoc(memoriesRef, {
      placeholder: true,
      createdAt: serverTimestamp()
    });

    // Create notifications subcollection
    const notificationsRef = collection(db, `users/${userId}/notifications`);
    await addDoc(notificationsRef, {
      placeholder: true,
      createdAt: serverTimestamp()
    });

    console.log("✅ User collections initialized");
  } catch (error) {
    console.error("❌ Error initializing collections:", error);
  }
}

async function updateUserMemoryCount(userId, increment_value) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        memoryCount: increment(increment_value)
      });
    });
  } catch (error) {
    console.error("❌ Error updating memory count:", error);
  }
}

async function notifyTaggedUsers(fromUserId, taggedUsers, memoryTitle) {
  try {
    taggedUsers.forEach(async (taggedUser) => {
      await addNotification(taggedUser.uid, {
        type: "memory_tagged",
        message: `Tagged you in a memory: "${memoryTitle}"`,
        fromUserId: fromUserId,
        read: false
      });
    });
  } catch (error) {
    console.error("❌ Error notifying tagged users:", error);
  }
}

console.log("🔥 Firebase initialized successfully!");