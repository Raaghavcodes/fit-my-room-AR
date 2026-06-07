import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { getRawModelUrl, getDimensions } from '../src/store/modelStore';

// Conditionally import expo-quick-look (only available in dev builds, not Expo Go)
let previewFile: ((options: { url: string }) => Promise<void>) | null = null;
try {
  console.log('DEBUG: Attempting to load @magrinj/expo-quick-look...');
  const quickLook = require('@magrinj/expo-quick-look');
  previewFile = quickLook.previewFile;
  console.log('DEBUG: @magrinj/expo-quick-look loaded successfully!', !!previewFile);
} catch (e) {
  console.log('DEBUG: @magrinj/expo-quick-look load failed:', e);
  previewFile = null;
}

const PROXY_BASE = process.env.EXPO_PUBLIC_PROXY_MODEL_URL || '';

export default function WebViewComponent({ htmlContent, modelUrl }: { htmlContent: string, modelUrl?: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const nativeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        body { margin: 0; padding: 0; background-color: #F3F4F6; height: 100vh; overflow: hidden; }
        model-viewer { width: 100%; height: 100%; }
      </style>
      <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
    </head>
    <body>
      <model-viewer 
        src="${modelUrl}" 
        camera-controls 
        auto-rotate
        tone-mapping="neutral" 
        shadow-intensity="1"
      ></model-viewer>
    </body>
    </html>
  `;

  const openInAR = async () => {
    const rawUrl = getRawModelUrl() || '';
    console.log('DEBUG: openInAR called. previewFile exists?', !!previewFile, 'Platform:', Platform.OS);

    if (previewFile && Platform.OS === 'ios') {
      try {
        setIsDownloading(true);

        // Build the proxy URL to download the model
        const proxyUrl = `${PROXY_BASE}?url=${encodeURIComponent(rawUrl)}`;

        // Download the GLB file to local storage
        const localPath = `${FileSystem.cacheDirectory}furniture_model.glb`;
        const downloadResult = await FileSystem.downloadAsync(proxyUrl, localPath);

        if (downloadResult.status !== 200) {
          throw new Error(`Download failed with status ${downloadResult.status}`);
        }

        setIsDownloading(false);

        // Open native AR Quick Look directly (no Safari!)
        await previewFile({ url: localPath });
      } catch (error: any) {
        setIsDownloading(false);
        console.error('AR Quick Look error:', error);
        Alert.alert('AR Error', error.message || 'Failed to open AR viewer');
      }
    } else {
      // Fallback: open in Safari (for Expo Go or Android)
      const { Linking } = require('react-native');
      const dims = getDimensions();
      
      // Pass the dimensions as query params to the AR Viewer cloud function
      let arPageUrl = `${process.env.EXPO_PUBLIC_AR_VIEWER_URL || ''}?url=${encodeURIComponent(rawUrl)}`;
      
      if (dims) {
        arPageUrl += `&fixed=1&w=${dims.width}&h=${dims.height}&d=${dims.depth}`;
      } else {
        arPageUrl += `&fixed=0`;
      }
      
      Linking.openURL(arPageUrl);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.webviewContainer}>
        <WebView 
          source={{ html: nativeHtml }} 
          style={{ flex: 1, backgroundColor: 'transparent' }} 
          scrollEnabled={false} 
          allowsInlineMediaPlayback
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
      <TouchableOpacity 
        style={[styles.arButton, isDownloading && styles.arButtonDisabled]} 
        onPress={openInAR}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.arButtonText}>  Preparing AR...</Text>
          </View>
        ) : (
          <Text style={styles.arButtonText}>👆 View in your space</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  webviewContainer: {
    flex: 1,
  },
  arButton: {
    backgroundColor: '#000000',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  arButtonDisabled: {
    backgroundColor: '#333333',
  },
  arButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
