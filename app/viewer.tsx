import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import WebViewComponent from './WebViewComponent';
import { getModelUrl } from '../src/store/modelStore';

export default function Viewer() {
  const { width, height, depth } = useLocalSearchParams<{
    width: string;
    height: string;
    depth: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const modelUrl = getModelUrl() || '';
  const hasDimensions = parseFloat(width) > 0 || parseFloat(height) > 0 || parseFloat(depth) > 0;

  console.log('Viewer modelUrl length:', modelUrl.length);

  const goHome = () => {
    // Navigate directly back to the tabs home, clearing the stack
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header bar — sits ABOVE the WebView, not overlaid */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>3D Viewer</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={goHome}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <X size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {!hasDimensions && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>No dimensions provided — AR size is estimated.</Text>
        </View>
      )}

      {/* WebView — takes remaining space, no overlays on it */}
      <View style={styles.viewerContainer}>
        <WebViewComponent
          htmlContent=""
          modelUrl={modelUrl}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#111111',
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningBanner: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  warningText: {
    color: '#D97706',
    fontWeight: '600',
    fontSize: 13,
  },
  viewerContainer: {
    flex: 1,
    width: '100%',
  },
});
