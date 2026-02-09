/**
 * Firestore Database Schema for Memory Forest
 * 
 * Structure Overview:
 * - users/
 * - connections/
 * - memories/ (subcollection under users)
 * - legacyTrees/
 * - publicForests/ (for community sharing)
 */

// ==================== USERS COLLECTION ====================
const usersSchema = {
    uid: "unique-firebase-uid",
    email: "user@example.com",
    displayName: "John Doe",
    bio: "A nature lover",
    profileImage: "https://...",
    createdAt: "2024-02-09T10:30:00Z",
    updatedAt: "2024-02-09T10:30:00Z",
    
    // Tree Statistics
    treeAge: 25,
    memoryCount: 47,
    treeHealth: 95,
    lastUpdated: "2024-02-09",
    
    // Preferences
    theme: "dark",
    privacy: "public",
    notifications: true,
    
    // Tree Customization
    treeSpecies: "oak",
    treeColor: "#7CFC00",
    
    // Stats
    totalConnections: 15,
    legacyTreeCount: 3,
    sharedForests: 2
};

// ==================== MEMORIES SUBCOLLECTION ====================
const memoriesSchema = {
    title: "Summer Vacation",
    description: "Amazing time at the beach",
    memoryType: "happy",           // happy, sad, special, normal, recovered
    date: "2024-06-15",
    createdAt: "2024-02-09T10:30:00Z",
    updatedAt: "2024-02-09T10:30:00Z",
    
    // Content
    content: {
        text: "Full memory description",
        imageUrls: ["https://...", "https://..."],
        videoUrl: "https://...",
        audioUrl: "https://..."
    },
    
    // Meta
    season: "summer",
    year: 2024,
    location: "Beach, California",
    
    // Tags
    tags: ["vacation", "family", "friends"],
    taggedPeople: [
        {
            uid: "user-123",
            displayName: "Alice",
            profileImage: "https://..."
        }
    ],
    
    // Engagement
    likes: 12,
    comments: [
        {
            userId: "user-456",
            userName: "Bob",
            text: "Amazing!",
            timestamp: "2024-02-09T11:00:00Z"
        }
    ],
    
    // Tree Visualization
    branchAngle: 45,               // Position on tree
    leafColor: "#FFD700",          // Based on memory type
    leafSize: 0.2,
    
    // Sharing
    isPublic: false,
    sharedWith: ["user-123", "user-456"]
};

// ==================== CONNECTIONS COLLECTION ====================
const connectionsSchema = {
    from: "user-123",              // Sender ID
    to: "user-456",                // Receiver ID
    connectionType: "friend",      // family, friend, mentor, colleague, romantic
    status: "accepted",            // pending, accepted, blocked
    createdAt: "2024-02-01T10:30:00Z",
    acceptedAt: "2024-02-02T10:30:00Z",
    
    // Custom info
    label: "College Friend",
    notes: "Met in 2018",
    
    // Relationship stats
    sharedMemories: 12,
    lastInteraction: "2024-02-08T15:20:00Z"
};

// ==================== LEGACY TREES COLLECTION ====================
const legacyTreesSchema = {
    userId: "user-123",
    title: "Graduation 2024",
    description: "Completed my bachelor's degree",
    eventDate: "2024-05-15",
    createdAt: "2024-02-09T10:30:00Z",
    
    // Visual
    treeColor: "#FFD700",
    treeEmoji: "🎓",
    
    // Content
    memories: ["memory-id-1", "memory-id-2"],
    documents: ["doc-1.pdf"],
    
    // Inheritance
    canInherit: true,
    inheritedBy: [],
    inheritFrom: null,
    
    // Sharing
    isPublic: false,
    sharedWith: ["user-456"]
};

// ==================== PUBLIC FORESTS COLLECTION ====================
const publicForestsSchema = {
    userId: "user-123",
    title: "Our Family Forest",
    description: "Shared memories with family",
    forestType: "family",         // family, group, community
    createdAt: "2024-01-15T10:30:00Z",
    
    // Members
    owner: "user-123",
    members: [
        {
            uid: "user-456",
            displayName: "Alice",
            role: "member"      // owner, editor, viewer
        }
    ],
    
    // Trees in forest
    trees: [
        {
            userId: "user-123",
            treeId: "tree-123",
            displayName: "John's Tree"
        }
    ],
    
    // Settings
    isPublic: true,
    allowJoinRequests: true,
    maxMembers: 50
};

// ==================== STATISTICS COLLECTION ====================
const statisticsSchema = {
    userId: "user-123",
    period: "2024-02",
    
    // Counts
    totalMemories: 47,
    memoriesByType: {
        happy: 25,
        sad: 5,
        special: 12,
        normal: 5,
        recovered: 0
    },
    
    // Engagement
    averageLikesPerMemory: 2.5,
    totalComments: 18,
    totalConnections: 15,
    
    // Timeline
    mostActiveMonth: "June",
    leastActiveMonth: "January",
    memoryAddRate: 2.1  // memories per week
};

// ==================== FIRESTORE RULES ====================
const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read: if request.auth.uid == userId || resource.data.privacy == 'public';
      allow write: if request.auth.uid == userId;
      
      // Memories subcollection
      match /memories/{memoryId} {
        allow read: if request.auth.uid == userId || resource.data.isPublic == true;
        allow create, update, delete: if request.auth.uid == userId;
      }
    }
    
    // Connections
    match /connections/{connectionId} {
      allow read: if request.auth.uid == resource.data.from || request.auth.uid == resource.data.to;
      allow create: if request.auth.uid == request.resource.data.from;
      allow update, delete: if request.auth.uid == resource.data.from || request.auth.uid == resource.data.to;
    }
    
    // Legacy Trees
    match /legacyTrees/{treeId} {
      allow read: if request.auth.uid == resource.data.userId || resource.data.isPublic == true;
      allow write: if request.auth.uid == resource.data.userId;
    }
    
    // Public Forests
    match /publicForests/{forestId} {
      allow read: if resource.data.isPublic == true;
      allow read: if request.auth.uid in resource.data.members[].uid;
      allow write: if request.auth.uid == resource.data.owner;
    }
  }
}
`;

module.exports = {
    usersSchema,
    memoriesSchema,
    connectionsSchema,
    legacyTreesSchema,
    publicForestsSchema,
    statisticsSchema,
    firestoreRules
};