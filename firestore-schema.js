/**
 * Complete Firestore Database Schema for Memory Forest
 * Collection structure, data models, and security rules
 */

// ==================== COLLECTION STRUCTURE ====================

export const firestoreSchema = {
  // ============ ROOT COLLECTIONS ============
  
  users: {
    description: "User profiles and account information",
    docSchema: {
      uid: "string",              // Firebase auth UID
      email: "string",
      displayName: "string",
      dateOfBirth: "timestamp",
      profileImage: "string",     // URL to profile image
      bio: "string",
      createdAt: "timestamp",
      updatedAt: "timestamp",
      
      // Tree Stats
      treeAge: "number",          // Age in years
      memoryCount: "number",
      treeHealth: "number",       // 0-100 percentage
      lastUpdated: "timestamp",
      
      // Social Stats
      totalConnections: "number",
      followers: "number",
      following: "number",
      
      // Preferences
      theme: "string",            // dark, light
      privacy: "string",          // public, private
      notifications: "boolean",
      
      // Tree Customization
      treeSpecies: "string",      // oak, willow, redwood, pine, etc.
      treeColor: "string",        // hex color
      
      // Engagement
      legacyTreeCount: "number",
      sharedForests: "number"
    },
    subcollections: {
      memories: "Memories subcollection",
      notifications: "Notifications subcollection",
      settings: "User settings"
    }
  },

  connections: {
    description: "Relationship connections between users",
    docSchema: {
      from: "string",             // Sender user ID
      to: "string",               // Receiver user ID
      fromName: "string",
      toName: "string",
      connectionType: "string",   // friend, family, mentor, colleague, romantic
      status: "string",           // pending, accepted, blocked
      category: "string",         // Custom category name
      createdAt: "timestamp",
      acceptedAt: "timestamp",
      updatedAt: "timestamp",
      
      // Relationship info
      label: "string",            // Custom label
      notes: "string",
      
      // Stats
      sharedMemories: "number",
      lastInteraction: "timestamp"
    }
  },

  legacyTrees: {
    description: "Special memory trees for important life events",
    docSchema: {
      userId: "string",
      ownerName: "string",
      title: "string",
      description: "string",
      eventDate: "timestamp",
      createdAt: "timestamp",
      updatedAt: "timestamp",
      
      // Visual
      treeColor: "string",
      treeEmoji: "string",
      icon: "string",
      
      // Content
      memories: "array",          // Memory IDs
      documents: "array",         // File URLs
      photos: "array",           // Image URLs
      
      // Inheritance
      canInherit: "boolean",
      inheritedBy: "array",      // User IDs
      inheritFrom: "string",     // Parent legacy tree ID
      
      // Sharing
      isPublic: "boolean",
      sharedWith: "array",       // User IDs
      
      // Stats
      viewCount: "number",
      likeCount: "number"
    }
  },

  publicForests: {
    description: "Community/shared forests",
    docSchema: {
      userId: "string",
      ownerName: "string",
      title: "string",
      description: "string",
      forestType: "string",      // family, group, community
      createdAt: "timestamp",
      updatedAt: "timestamp",
      
      // Ownership
      owner: "string",
      members: [{
        uid: "string",
        displayName: "string",
        profileImage: "string",
        role: "string"           // owner, editor, viewer
      }],
      
      // Trees
      trees: [{
        userId: "string",
        treeId: "string",
        displayName: "string"
      }],
      
      // Settings
      isPublic: "boolean",
      allowJoinRequests: "boolean",
      maxMembers: "number",
      
      // Stats
      memberCount: "number",
      treeCount: "number"
    }
  },

  statistics: {
    description: "Aggregate statistics for analytics",
    docSchema: {
      userId: "string",
      period: "string",          // YYYY-MM format
      
      // Counts
      totalMemories: "number",
      memoriesByType: {
        happy: "number",
        sad: "number",
        special: "number",
        normal: "number",
        recovered: "number"
      },
      
      // Engagement
      averageLikesPerMemory: "number",
      totalComments: "number",
      totalConnections: "number",
      
      // Timeline
      mostActiveMonth: "string",
      leastActiveMonth: "string",
      memoryAddRate: "number",    // per week
      
      // Trends
      growthRate: "number",
      engagementScore: "number"
    }
  },

  // ============ SUBCOLLECTIONS ===========

  "users/{userId}/memories": {
    description: "User's memory collection",
    docSchema: {
      title: "string",
      description: "string",
      memoryType: "string",      // happy, sad, special, normal, recovered
      date: "timestamp",
      createdAt: "timestamp",
      updatedAt: "timestamp",
      
      // Content
      content: {
        text: "string",
        imageUrls: "array",
        videoUrl: "string",
        audioUrl: "string"
      },
      
      // Metadata
      season: "string",          // spring, summer, autumn, winter
      year: "number",
      month: "number",
      location: "string",
      
      // Tags
      tags: "array",
      taggedPeople: [{
        uid: "string",
        displayName: "string",
        profileImage: "string"
      }],
      
      // Engagement
      likes: "number",
      comments: [{
        userId: "string",
        userName: "string",
        text: "string",
        timestamp: "timestamp"
      }],
      shares: "number",
      
      // Tree visualization
      branchAngle: "number",
      leafColor: "string",
      leafSize: "number",
      
      // Sharing
      isPublic: "boolean",
      sharedWith: "array"
    }
  },

  "users/{userId}/notifications": {
    description: "User's notifications",
    docSchema: {
      type: "string",            // memory_tagged, connection_request, etc.
      message: "string",
      fromUserId: "string",
      fromUserName: "string",
      memoryId: "string",
      connectionId: "string",
      createdAt: "timestamp",
      read: "boolean",
      
      // Action URLs
      actionType: "string",
      actionData: "map"
    }
  }
};

// ==================== FIRESTORE SECURITY RULES ====================

export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - read own or public, write only own
    match /users/{userId} {
      allow read: if request.auth.uid == userId 
                     || resource.data.privacy == 'public';
      allow write: if request.auth.uid == userId;
      
      // Memories subcollection
      match /memories/{memoryId} {
        allow read: if request.auth.uid == userId 
                       || resource.data.isPublic == true
                       || request.auth.uid in resource.data.sharedWith;
        allow create: if request.auth.uid == userId;
        allow update: if request.auth.uid == userId;
        allow delete: if request.auth.uid == userId;
      }
      
      // Notifications subcollection
      match /notifications/{notificationId} {
        allow read: if request.auth.uid == userId;
        allow update: if request.auth.uid == userId;
        allow delete: if request.auth.uid == userId;
      }
    }
    
    // Connections - visible to both parties
    match /connections/{connectionId} {
      allow read: if request.auth.uid == resource.data.from 
                     || request.auth.uid == resource.data.to;
      allow create: if request.auth.uid == request.resource.data.from;
      allow update: if request.auth.uid == resource.data.from 
                       || request.auth.uid == resource.data.to;
      allow delete: if request.auth.uid == resource.data.from;
    }
    
    // Legacy Trees
    match /legacyTrees/{treeId} {
      allow read: if request.auth.uid == resource.data.userId 
                     || resource.data.isPublic == true
                     || request.auth.uid in resource.data.sharedWith;
      allow create: if request.auth.uid != null;
      allow update: if request.auth.uid == resource.data.userId;
      allow delete: if request.auth.uid == resource.data.userId;
    }
    
    // Public Forests
    match /publicForests/{forestId} {
      allow read: if resource.data.isPublic == true
                     || request.auth.uid in resource.data.members[].uid;
      allow create: if request.auth.uid != null;
      allow update, delete: if request.auth.uid == resource.data.owner;
    }
    
    // Statistics
    match /statistics/{statsId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.uid == resource.data.userId;
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`;

// ==================== DATA INITIALIZATION ====================

export async function initializeUserDatabase(userId, userData) {
  return {
    uid: userId,
    email: userData.email,
    displayName: userData.displayName,
    dateOfBirth: userData.dateOfBirth,
    profileImage: "",
    bio: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // Tree stats
    treeAge: calculateAge(userData.dateOfBirth),
    memoryCount: 0,
    treeHealth: 100,
    lastUpdated: new Date(),
    
    // Social
    totalConnections: 0,
    followers: 0,
    following: 0,
    
    // Preferences
    theme: "dark",
    privacy: "public",
    notifications: true,
    
    // Tree
    treeSpecies: "oak",
    treeColor: "#7CFC00",
    
    // Engagement
    legacyTreeCount: 0,
    sharedForests: 0
  };
}

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

// ==================== BATCH OPERATIONS ====================

export const batchOperations = {
  // Bulk create memories
  createMemoriesBatch: `
    Batch write to create multiple memories atomically
    Use when bulk uploading memories
  `,
  
  // Update user stats
  updateUserStatsBatch: `
    Update user memory count, tree health, and other stats
    Atomic operation ensuring consistency
  `,
  
  // Handle connection acceptance
  acceptConnectionBatch: `
    Update connection status
    Add to both users' connection lists
    Create notification for both parties
  `,
  
  // Delete memory with cascading
  deleteMemoryCascade: `
    Delete memory document
    Remove from shared collections
    Update parent user stats
  `
};

export default {
  firestoreSchema,
  firestoreRules,
  initializeUserDatabase,
  batchOperations
};