import React, { useEffect, useState } from 'react';
import { Tabs, router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { auth } from '../../src/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Custom icon components matching the Stitch bottom nav exactly
const HistoryIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <Path d="M3 3v5h5" />
    <Path d="M12 7v5l4 2" />
  </Svg>
);

const ViewerIcon = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <Path d="M3.27 6.96 12 12.01l8.73-5.05" />
    <Path d="M12 22.08V12" />
  </Svg>
);

const AccountIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
  </Svg>
);

export default function TabLayout() {
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Not logged in! Kick them out explicitly to the unambiguous welcome screen
        router.replace('/welcome');
      }
      setIsAuthChecking(false);
    });
    return unsubscribe;
  }, []);

  if (isAuthChecking) return null;

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: '#e2e8f0',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: '#0f172a',
          letterSpacing: -0.3,
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: '#f1f5f9',
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerTitle: 'My Library',
          tabBarIcon: ({ color, size }) => <HistoryIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Viewer',
          headerTitle: 'Fit My Room',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.viewerIconWrap, focused && styles.viewerIconActive]}>
              <ViewerIcon color={focused ? '#059669' : color} size={size} focused={focused} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerTitle: 'FIT MY ROOM',
          tabBarIcon: ({ color, size }) => <AccountIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  viewerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerIconActive: {
    backgroundColor: '#ecfdf5',
  },
});
