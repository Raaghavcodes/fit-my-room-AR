import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WebViewComponent({ htmlContent, modelUrl, hasDimensions }: { htmlContent: string, modelUrl?: string, hasDimensions?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the model-viewer script once
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Build the model-viewer via innerHTML so the Web Component works outside React's VDOM
    containerRef.current.innerHTML = `
      <model-viewer
        src="${modelUrl}"
        camera-controls
        tone-mapping="neutral"
        shadow-intensity="1"
        style="width: 100%; height: 100%; background-color: #F3F4F6; outline: none;"
        interaction-prompt="auto"
        auto-rotate
      ></model-viewer>
    `;
  }, [modelUrl, hasDimensions]);

  return (
    <View style={styles.container}>
      <div ref={containerRef} style={{ width: '100%', flex: 1, minHeight: 500 }} />
      <View style={styles.arNotice}>
        <Text style={styles.arNoticeTitle}>📱 AR Preview</Text>
        <Text style={styles.arNoticeText}>
          To place this item in your room using AR, open this app on your iPhone or Android device via Expo Go. 
          AR is not supported in desktop web browsers.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  arNotice: {
    backgroundColor: '#EFF6FF',
    borderTopWidth: 1,
    borderTopColor: '#BFDBFE',
    padding: 16,
    alignItems: 'center',
  },
  arNoticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  arNoticeText: {
    fontSize: 14,
    color: '#1E40AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
