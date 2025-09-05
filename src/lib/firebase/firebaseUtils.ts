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
import { User, Post } from "../types";

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

// Sports App Specific Functions

// User Profile Management
export const createUserProfile = async (user: any, additionalData: any = {}) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    throw new Error("Firebase Firestore not available");
  }

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    
    try {
      await addDocument('users', {
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  return userRef;
};

export const getUserProfile = async (userId: string) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    return null;
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Posts Management
export const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'views' | 'likedBy'>) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    throw new Error("Firebase Firestore not available");
  }

  try {
    const newPost = {
      ...postData,
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      views: 0,
      likedBy: []
    };

    const docRef = await addDocument('posts', newPost);
    return { id: docRef.id, ...newPost };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPosts = async () => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    return [];
  }

  try {
    const posts = await getDocuments('posts');
    const processedPosts = posts.map((post: any) => ({
      ...post,
      createdAt: post.createdAt?.toDate ? post.createdAt.toDate().toISOString() : post.createdAt
    }));
    
    return processedPosts.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
};

export const togglePostLike = async (postId: string, userId: string, isLiked: boolean) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    throw new Error("Firebase Firestore not available");
  }

  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const postData = postSnap.data();
      const likedBy = postData.likedBy || [];
      
      if (isLiked) {
        // Add like
        await updateDocument('posts', postId, {
          likes: postData.likes + 1,
          likedBy: arrayUnion(userId)
        });
      } else {
        // Remove like
        await updateDocument('posts', postId, {
          likes: Math.max(0, postData.likes - 1),
          likedBy: arrayRemove(userId)
        });
      }
    }
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const incrementPostViews = async (postId: string) => {
  if (!db) {
    console.warn("Firebase Firestore not available");
    return;
  }

  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const postData = postSnap.data();
      await updateDocument('posts', postId, {
        views: (postData.views || 0) + 1
      });
    }
  } catch (error) {
    console.error('Error incrementing post views:', error);
  }
};
