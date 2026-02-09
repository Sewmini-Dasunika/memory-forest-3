/**
 * Memory Forest Mobile App Setup
 * React Native Configuration
 * 
 * To create a mobile app:
 * 1. Install: npx react-native init MemoryForest
 * 2. Install Firebase: npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
 * 3. Copy this configuration
 */

// app.json - Expo Configuration
const appJson = {
    "expo": {
        "name": "Memory Forest",
        "slug": "memory-forest",
        "version": "1.0.0",
        "assetBundlePatterns": ["**/*"],
        "ios": {
            "supportsTabletMultitasking": true,
            "bundleIdentifier": "com.memoryforest.app"
        },
        "android": {
            "adaptiveIcon": {
                "foregroundImage": "./assets/adaptive-icon.png",
                "backgroundColor": "#ffffff"
            },
            "package": "com.memoryforest.app"
        },
        "plugins": [
            "@react-native-firebase/app",
            "@react-native-firebase/auth",
            "@react-native-firebase/firestore"
        ]
    }
};

// package.json - Dependencies
const packageJson = {
    "dependencies": {
        "react": "^18.2.0",
        "react-native": "^0.72.0",
        "@react-navigation/native": "^6.1.8",
        "@react-navigation/bottom-tabs": "^6.5.8",
        "@react-navigation/stack": "^6.3.17",
        "react-native-screens": "^3.25.0",
        "react-native-safe-area-context": "^4.7.2",
        "react-native-gesture-handler": "^2.13.3",
        "@react-native-firebase/app": "^18.0.0",
        "@react-native-firebase/auth": "^18.0.0",
        "@react-native-firebase/firestore": "^18.0.0",
        "@react-native-firebase/storage": "^18.0.0",
        "react-native-svg": "^13.14.0",
        "expo": "^49.0.0",
        "expo-camera": "^13.4.4",
        "expo-image-picker": "^14.3.2",
        "axios": "^1.4.0"
    },
    "devDependencies": {
        "@types/react": "^18.2.0",
        "@types/react-native": "^0.72.0",
        "typescript": "^5.1.0"
    }
};

// Core Mobile Components Structure
const mobileStructure = `
src/
├── screens/
│   ├── HomeScreen.jsx           # Main landing
│   ├── LoginScreen.jsx          # Authentication
│   ├── RegisterScreen.jsx       # User signup
│   ├── MyForestScreen.jsx       # 3D tree (React Three Fiber for mobile)
│   ├── AddMemoryScreen.jsx      # Memory form
│   ├── MemoriesListScreen.jsx   # Gallery view
│   ├── ConnectionsScreen.jsx    # User network
│   ├── ProfileScreen.jsx        # User profile
│   └── SettingsScreen.jsx       # App settings
├── navigation/
│   ├── AuthNavigator.jsx        # Auth flow
│   └── AppNavigator.jsx         # Main app flow
├── components/
│   ├── MemoryCard.jsx
│   ├── TreeViewer.jsx           # 3D tree component
│   ├── LoadingSpinner.jsx
│   └── BottomTabBar.jsx
├── services/
│   ├── authService.js
│   ├── firebaseService.js
│   └── storageService.js
├── context/
│   ├── AuthContext.jsx
│   └── DataContext.jsx
├── screens/
│   └── styles/
└── App.jsx                      # Main app entry
`;

// Sample Mobile Screen Component
const HomeScreenSample = `
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
    const { user } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🌲 Memory Forest</Text>
            <Text style={styles.subtitle}>Welcome, {user?.displayName}!</Text>
            
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('MyForest')}
            >
                <Text style={styles.buttonText}>View My Tree</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('AddMemory')}
            >
                <Text style={styles.buttonText}>+ Add Memory</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('Memories')}
            >
                <Text style={styles.buttonText}>My Memories</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0e27',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#7CFC00',
        marginBottom: 10
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 30
    },
    button: {
        backgroundColor: '#7CFC00',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginVertical: 10,
        width: '100%'
    },
    buttonText: {
        color: '#0a0e27',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    }
});
`;

module.exports = {
    appJson,
    packageJson,
    mobileStructure,
    HomeScreenSample
};