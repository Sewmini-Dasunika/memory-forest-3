/**
 * Memory Forest - Mobile App Setup
 * React Native with Firebase Integration
 * 
 * Installation:
 * npx react-native init MemoryForestMobile
 * npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage
 */

// app.json - React Native Configuration
export const appJson = {
  "name": "Memory Forest",
  "displayName": "Memory Forest",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "@react-native-firebase/app": "^18.0.0",
    "@react-native-firebase/auth": "^18.0.0",
    "@react-native-firebase/firestore": "^18.0.0",
    "@react-native-firebase/storage": "^18.0.0",
    "@react-navigation/native": "^6.1.8",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "@react-navigation/stack": "^6.3.17",
    "react": "18.2.0",
    "react-native": "0.72.3",
    "react-native-screens": "^3.25.0",
    "react-native-safe-area-context": "^4.7.2",
    "react-native-gesture-handler": "^2.13.3",
    "react-native-image-picker": "^5.7.0",
    "react-native-camera": "^4.2.1",
    "expo": "^49.0.0",
    "expo-image-picker": "^14.3.2",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "@babel/preset-react": "^7.23.0",
    "@babel/preset-typescript": "^7.23.0",
    "babel-jest": "^29.7.0",
    "jest": "^29.7.0",
    "metro-react-native-babel-preset": "^0.77.0"
  }
};

// Mobile App Structure (React Native)
export const mobileStructure = `
MemoryForestMobile/
├── src/
│   ├── screens/
│   │   ├── AuthScreens/
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── RegisterScreen.jsx
│   │   │   └── AuthStyles.js
│   │   ├── MainScreens/
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── MyForestScreen.jsx
│   │   │   ├── AddMemoryScreen.jsx
│   │   │   ├── MemoriesScreen.jsx
│   │   │   ├── ConnectionsScreen.jsx
│   │   │   ├── ProfileScreen.jsx
│   │   │   └── ScreenStyles.js
│   │   └── DetailScreens/
│   │       ├── MemoryDetailScreen.jsx
│   │       └── UserProfileScreen.jsx
│   ├── navigation/
│   │   ├── AuthNavigator.jsx
│   │   ├── AppNavigator.jsx
│   │   └── RootNavigator.jsx
│   ├── components/
│   │   ├── MemoryCard.jsx
│   │   ├── UserCard.jsx
│   │   ├── TreeViewer.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── TabBar.jsx
│   │   └── BottomSheet.jsx
│   ├── services/
│   │   ├── FirebaseService.js
│   │   ├── AuthService.js
│   │   ├── StorageService.js
│   │   └── NotificationService.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── TreeContext.jsx
│   │   └── NotificationContext.jsx
│   ├── utils/
│   │   ├── dateUtils.js
│   │   ├── treeUtils.js
│   │   └── validators.js
│   ├── styles/
│   │   ├── colors.js
│   │   ├── typography.js
│   │   └── spacing.js
│   ├── App.jsx
│   └── index.js
├── android/
│   ├── app/
│   │   └── google-services.json (Firebase config)
│   └── build.gradle
├── ios/
│   ├── GoogleService-Info.plist (Firebase config)
│   └── Podfile
├── app.json
├── package.json
└── README.md
`;

// Sample Mobile Screen - Home Screen
export const HomeScreenSample = `
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { TreeContext } from '../context/TreeContext';
import colors from '../styles/colors';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const { tree, statistics } = useContext(TreeContext);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      alert('Error logging out: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>🌳 Welcome!</Text>
          <Text style={styles.userName}>{user?.displayName}</Text>
        </View>

        {/* Tree Stats */}
        {tree && (
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Age</Text>
                <Text style={styles.statValue}>{statistics?.age} yrs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Memories</Text>
                <Text style={styles.statValue}>{statistics?.memoryCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Health</Text>
                <Text style={styles.statValue}>{statistics?.health}%</Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => navigation.navigate('AddMemory')}
          >
            <Text style={styles.actionButtonText}>+ Add Memory</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('MyForest')}
          >
            <Text style={styles.actionButtonText}>View Tree</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('Memories')}
          >
            <Text style={styles.actionButtonText}>My Memories</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('Connections')}
          >
            <Text style={styles.actionButtonText}>Connections</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.logoutText}>Logout</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  userName: {
    fontSize: 18,
    color: colors.text,
    opacity: 0.7,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 30,
  },
  actionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.accent,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
`;

// Mobile Navigation Setup
export const NavigationSetup = `
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from './context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './screens/AuthScreens/LoginScreen';
import RegisterScreen from './screens/AuthScreens/RegisterScreen';
import HomeScreen from './screens/MainScreens/HomeScreen';
import MyForestScreen from './screens/MainScreens/MyForestScreen';
import AddMemoryScreen from './screens/MainScreens/AddMemoryScreen';
import MemoriesScreen from './screens/MainScreens/MemoriesScreen';
import ConnectionsScreen from './screens/MainScreens/ConnectionsScreen';
import ProfileScreen from './screens/MainScreens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#7CFC00',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="MyForest"
        component={MyForestScreen}
        options={{
          title: 'My Forest',
          tabBarLabel: 'Forest',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🌲</Text>,
        }}
      />
      <Tab.Screen
        name="AddMemory"
        component={AddMemoryScreen}
        options={{
          title: 'Add Memory',
          tabBarLabel: 'Add',
          tabBarIcon: ({ color }) => <Text style={{ color }}>➕</Text>,
        }}
      />
      <Tab.Screen
        name="Memories"
        component={MemoriesScreen}
        options={{
          title: 'Memories',
          tabBarLabel: 'Memories',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📸</Text>,
        }}
      />
      <Tab.Screen
        name="Connections"
        component={ConnectionsScreen}
        options={{
          title: 'Connections',
          tabBarLabel: 'Connections',
          tabBarIcon: ({ color }) => <Text style={{ color }}>👥</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7CFC00" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="App" component={AppTabs} />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
`;

export default {
  appJson,
  mobileStructure,
  HomeScreenSample,
  NavigationSetup
};