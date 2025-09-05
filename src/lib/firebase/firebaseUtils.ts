import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "../types";

// Auth functions
export const logoutUser = () => {
  if (!auth) {
    console.warn("Firebase auth not available");
    return Promise.resolve();
  }
  return signOut(auth);
};

export const signInWithGoogle = async () => {
  if (!auth) {
    console.warn("Firebase auth not available");
    throw new Error("Firebase auth not available");
  }

  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    throw new Error("Firebase Firestore not available");
  }
  return addDoc(collection(db, collectionName), data);
};

export const getDocuments = async (collectionName: string) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    return [];
  }
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    throw new Error("Firebase Firestore not available");
  }
  return updateDoc(doc(db, collectionName, id), data);
};

export const deleteDocument = (collectionName: string, id: string) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    throw new Error("Firebase Firestore not available");
  }
  return deleteDoc(doc(db, collectionName, id));
};

// Like functions
export const likePost = async (postId: string, userId: string) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    throw new Error("Firebase Firestore not available");
  }
  
  const postRef = doc(db, "posts", postId);
  return updateDoc(postRef, {
    likedBy: arrayUnion(userId),
    likes: 1 // This will be handled by a cloud function in production
  });
};

export const unlikePost = async (postId: string, userId: string) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    throw new Error("Firebase Firestore not available");
  }
  
  const postRef = doc(db, "posts", postId);
  return updateDoc(postRef, {
    likedBy: arrayRemove(userId),
    likes: -1 // This will be handled by a cloud function in production
  });
};

// Follow functions
export const followUser = async (followerId: string, followingId: string) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    throw new Error("Firebase Firestore not available");
  }
  
  const batch = writeBatch(db);
  
  // Add to follower's following list
  const followerRef = doc(db, "users", followerId);
  batch.update(followerRef, {
    following: arrayUnion(followingId),
    followingCount: 1 // This will be handled by a cloud function in production
  });
  
  // Add to following user's followers list
  const followingRef = doc(db, "users", followingId);
  batch.update(followingRef, {
    followers: arrayUnion(followerId),
    followersCount: 1 // This will be handled by a cloud function in production
  });
  
  return batch.commit();
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    throw new Error("Firebase Firestore not available");
  }
  
  const batch = writeBatch(db);
  
  // Remove from follower's following list
  const followerRef = doc(db, "users", followerId);
  batch.update(followerRef, {
    following: arrayRemove(followingId),
    followingCount: -1 // This will be handled by a cloud function in production
  });
  
  // Remove from following user's followers list
  const followingRef = doc(db, "users", followingId);
  batch.update(followingRef, {
    followers: arrayRemove(followerId),
    followersCount: -1 // This will be handled by a cloud function in production
  });
  
  return batch.commit();
};

export const checkIfFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    return false;
  }
  
  const userRef = doc(db, "users", followerId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return false;
  }
  
  const userData = userDoc.data();
  return userData.following?.includes(followingId) || false;
};

export const getUserFollowers = async (userId: string): Promise<User[]> => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    return [];
  }
  
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return [];
  }
  
  const userData = userDoc.data();
  const followerIds = userData.followers || [];
  
  if (followerIds.length === 0) {
    return [];
  }
  
  const followers = await Promise.all(
    followerIds.map(async (followerId: string) => {
      const followerRef = doc(db, "users", followerId);
      const followerDoc = await getDoc(followerRef);
      if (followerDoc.exists()) {
        return { id: followerDoc.id, ...followerDoc.data() } as User;
      }
      return null;
    })
  );
  
  return followers.filter(Boolean) as User[];
};

export const getUserFollowing = async (userId: string): Promise<User[]> => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    return [];
  }
  
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return [];
  }
  
  const userData = userDoc.data();
  const followingIds = userData.following || [];
  
  if (followingIds.length === 0) {
    return [];
  }
  
  const following = await Promise.all(
    followingIds.map(async (followingId: string) => {
      const followingRef = doc(db, "users", followingId);
      const followingDoc = await getDoc(followingRef);
      if (followingDoc.exists()) {
        return { id: followingDoc.id, ...followingDoc.data() } as User;
      }
      return null;
    })
  );
  
  return following.filter(Boolean) as User[];
};

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  if (!storage) {
    console.warn("Firebase Storage not available");
    throw new Error("Firebase Storage not available");
  }
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
