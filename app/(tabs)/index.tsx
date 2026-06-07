import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Platform, Dimensions, Linking, AppState } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Plus, ShieldAlert } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { setInputImages } from '../../src/store/modelStore';
import { TripoImageInput } from '../../src/services/tripoService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 20;
const GRID_GAP = 12;
const SLOT_SIZE = (SCREEN_WIDTH - (GRID_PADDING * 2) - GRID_GAP) / 2;

type Angle = 'front' | 'back' | 'left' | 'right';
const ANGLES: { id: Angle; required: boolean }[] = [
  { id: 'front', required: true },
  { id: 'back', required: false },
  { id: 'left', required: false },
  { id: 'right', required: false },
];

export default function CaptureScreen() {
  const [images, setImages] = useState<Partial<Record<Angle, string>>>({});
  const [cameraStatus, setCameraStatus] = useState<ImagePicker.PermissionStatus | null>(null);
  const [libraryStatus, setLibraryStatus] = useState<ImagePicker.PermissionStatus | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check initial permissions
    checkPermissions();

    // Listen for app coming back to foreground to refresh permission states
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkPermissions();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const checkPermissions = async () => {
    if (Platform.OS === 'web') return;
    try {
      const camera = await ImagePicker.getCameraPermissionsAsync();
      const library = await ImagePicker.getMediaLibraryPermissionsAsync();
      setCameraStatus(camera.status);
      setLibraryStatus(library.status);
    } catch (e) {
      console.error('Failed to get permissions:', e);
    }
  };

  const handleImageAction = (angle: Angle) => {
    if (Platform.OS === 'web') {
      pickImage(angle);
      return;
    }
    Alert.alert(
      'Add Photo',
      'Choose a media source',
      [
        { text: 'Camera', onPress: () => handleCameraPress(angle) },
        { text: 'Gallery', onPress: () => handleLibraryPress(angle) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleCameraPress = async (angle: Angle) => {
    if (cameraStatus === 'denied') {
      Alert.alert(
        "Camera Access Required",
        "Fit My Room needs camera access to take photos of your furniture. Please enable it in your device settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    setCameraStatus(permissionResult.status);

    if (permissionResult.granted) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setImages(prev => ({ ...prev, [angle]: result.assets[0].uri }));
      }
    }
  };

  const handleLibraryPress = async (angle: Angle) => {
    if (libraryStatus === 'denied') {
      Alert.alert(
        "Photos Access Required",
        "Fit My Room needs access to your library to select images. Please enable it in your device settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setLibraryStatus(permissionResult.status);

    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setImages(prev => ({ ...prev, [angle]: result.assets[0].uri }));
      }
    }
  };

  const pickImage = async (angle: Angle) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImages(prev => ({ ...prev, [angle]: result.assets[0].uri }));
    }
  };

  const proceedToNext = () => {
    if (!images.front) {
      Alert.alert("Missing Image", "The front image is required to generate a 3D model.");
      return;
    }
    const payload: TripoImageInput[] = Object.entries(images)
      .filter(([_, uri]) => !!uri)
      .map(([type, uri]) => ({
        type: type as Angle,
        uri: uri as string
      }));
    setInputImages(payload);
    router.push('/dimensions');
  };

  const hasFront = !!images.front;

  const isBothDenied = cameraStatus === 'denied' && libraryStatus === 'denied';
  const isCameraDenied = cameraStatus === 'denied';
  const isLibraryDenied = libraryStatus === 'denied';

  if (isBothDenied) {
    return (
      <View style={styles.fallbackContainer}>
        <ShieldAlert size={64} color="#ef4444" style={{ marginBottom: 16 }} />
        <Text style={styles.fallbackTitle}>Permissions Required</Text>
        <Text style={styles.fallbackText}>
          Fit My Room needs access to your Camera and Photo Library to capture and upload images of your furniture for 3D model generation.
        </Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => Linking.openSettings()} activeOpacity={0.8}>
          <Text style={styles.settingsButtonText}>Open Device Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Text */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Capture Views</Text>
        <Text style={styles.subtitle}>Provide all angles for optimal AI reconstruction.</Text>
      </View>

      {/* Partial Permission Warnings */}
      {(isCameraDenied || isLibraryDenied) && (
        <View style={styles.warningCard}>
          <ShieldAlert size={20} color="#b45309" />
          <View style={styles.warningContent}>
            <Text style={styles.warningCardTitle}>Limited Access</Text>
            <Text style={styles.warningCardText}>
              {isCameraDenied 
                ? "Camera access is disabled. You can only upload existing photos from your Gallery." 
                : "Photo Library access is disabled. You can only take new photos via your Camera."}
            </Text>
            <TouchableOpacity onPress={() => Linking.openSettings()} activeOpacity={0.7}>
              <Text style={styles.warningCardLink}>Enable in Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 2x2 Photo Grid */}
      <View style={styles.grid}>
        {ANGLES.map(angle => (
          <TouchableOpacity
            key={angle.id}
            style={styles.slot}
            onPress={() => handleImageAction(angle.id)}
            activeOpacity={0.7}
          >
            {/* Required badge — only on front slot when empty */}
            {angle.required && !images[angle.id] && (
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>REQUIRED</Text>
              </View>
            )}

            {images[angle.id] ? (
              <Image source={{ uri: images[angle.id] }} style={styles.image} />
            ) : (
              <View style={styles.plusCircle}>
                <Plus size={22} color="#76777d" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, !hasFront && styles.nextButtonDisabled]}
        onPress={proceedToNext}
        disabled={!hasFront}
        activeOpacity={0.85}
      >
        <Text style={[styles.nextButtonText, !hasFront && styles.nextButtonTextDisabled]}>Next</Text>
      </TouchableOpacity>
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
    paddingBottom: 32,
    flexGrow: 1,
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0b1c30',
    marginBottom: 12,
    textAlign: 'center',
  },
  fallbackText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#45464d',
    textAlign: 'center',
    marginBottom: 28,
  },
  settingsButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  settingsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fef3c7',
    padding: 16,
    marginBottom: 20,
    alignItems: 'flex-start',
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  warningCardText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#b45309',
    marginBottom: 8,
  },
  warningCardLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
    textDecorationLine: 'underline',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0b1c30',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#45464d',
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: GRID_GAP,
    marginBottom: 40,
  },
  slot: {
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    backgroundColor: '#e5eeff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#c6c6cd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  requiredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  requiredText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  plusCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d3e4fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  nextButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#000000',
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: '#ffffff',
  },
});
