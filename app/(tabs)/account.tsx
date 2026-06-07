import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { ChevronRight, HelpCircle, Info, FileText, LogOut, Ruler } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import { auth } from '../../src/config/firebase';
import { logOut } from '../../src/services/authService';
import { updateProfile } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Edit icon (pencil)
const EditIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <Path d="m15 5 4 4" />
  </Svg>
);

export default function AccountScreen() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || 'User');

  // Load saved unit preference
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedUnit = await AsyncStorage.getItem('@furniture_unit');
        if (savedUnit === 'in' || savedUnit === 'cm') {
          setUnit(savedUnit);
        }
      } catch (e) {
        console.error('Failed to load unit preference', e);
      }
    };
    loadPreferences();
  }, []);

  const handleUnitChange = async (newUnit: 'in' | 'cm') => {
    setUnit(newUnit);
    try {
      await AsyncStorage.setItem('@furniture_unit', newUnit);
    } catch (e) {
      console.error('Failed to save unit preference', e);
    }
  };

  // Update local state if firebase state changes
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user?.displayName]);

  const handleEditProfile = () => {
    Alert.prompt(
      "Edit Name",
      "Enter your new display name",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Save", 
          onPress: async (newName) => {
            if (newName && newName.trim() && user) {
              try {
                await updateProfile(user, { displayName: newName.trim() });
                setDisplayName(newName.trim());
              } catch (error) {
                console.error('Failed to update profile:', error);
                Alert.alert('Error', 'Could not update your name.');
              }
            }
          }
        }
      ],
      "plain-text",
      displayName
    );
  };

  const handleLogout = async () => {
    try {
      await logOut();
      // Instantly route back to the unambiguous intro screen upon manual logout
      router.replace('/welcome');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Page Title */}
      <Text style={styles.pageTitle}>Account</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'Not signed in'}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.6} onPress={handleEditProfile}>
          <EditIcon />
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <Text style={styles.sectionTitle}>PREFERENCES</Text>
      <View style={styles.sectionCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ruler size={20} color="#45464d" />
            <Text style={styles.settingLabel}>Default Units</Text>
          </View>
          <View style={styles.unitToggle}>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'in' && styles.unitButtonActive]}
              onPress={() => handleUnitChange('in')}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitText, unit === 'in' && styles.unitTextActive]}>Inches</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'cm' && styles.unitButtonActive]}
              onPress={() => handleUnitChange('cm')}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitText, unit === 'cm' && styles.unitTextActive]}>CM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Support & About Section */}
      <Text style={styles.sectionTitle}>SUPPORT & ABOUT</Text>
      <View style={styles.sectionCard}>
        <TouchableOpacity style={styles.menuRow} activeOpacity={0.6}>
          <View style={styles.settingLeft}>
            <HelpCircle size={20} color="#45464d" />
            <Text style={styles.settingLabel}>Contact Support</Text>
          </View>
          <ChevronRight size={20} color="#c6c6cd" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuRow} activeOpacity={0.6} onPress={() => router.push('/privacy')}>
          <View style={styles.settingLeft}>
            <Info size={20} color="#45464d" />
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </View>
          <ChevronRight size={20} color="#c6c6cd" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuRow} activeOpacity={0.6} onPress={() => router.push('/terms')}>
          <View style={styles.settingLeft}>
            <FileText size={20} color="#45464d" />
            <Text style={styles.settingLabel}>Terms of Service</Text>
          </View>
          <ChevronRight size={20} color="#c6c6cd" />
        </TouchableOpacity>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7} onPress={handleLogout}>
        <LogOut size={20} color="#ba1a1a" />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.version}>v1.0.4</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0b1c30',
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#0b1c30',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e5eeff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0b1c30',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#76777d',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#76777d',
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 32,
    shadowColor: '#0b1c30',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0b1c30',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#e5eeff',
    borderRadius: 20,
    padding: 3,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
  },
  unitButtonActive: {
    backgroundColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#76777d',
  },
  unitTextActive: {
    color: '#ffffff',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5eeff',
  },
  logoutButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#ffeaea',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ba1a1a',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    color: '#76777d',
  },
});
