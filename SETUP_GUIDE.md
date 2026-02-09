# 🌲 Memory Forest - Complete Setup Guide

## 📋 Table of Contents
1. Firebase Setup
2. Web Application Setup
3. Mobile App Setup
4. Database Configuration
5. Deployment

---

## 🔥 1. Firebase Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a new project"**
3. Name it: **"memory-forest"**
4. Enable Google Analytics
5. Click **"Create project"**

### Step 2: Enable Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (optional)

### Step 3: Create Firestore Database
1. Go to **Firestore Database** > **Create Database**
2. Select **Start in production mode**
3. Set region: **us-central1** (or closest to you)

### Step 4: Get Your Config
1. Go to **Project Settings**
2. Click **</> (Web)**
3. Copy the config object
4. Paste into `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};