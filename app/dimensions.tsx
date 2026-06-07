import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { startModelGeneration, checkModelStatus } from '../src/services/tripoService';
import { setModelUrl, getInputImages } from '../src/store/modelStore';
import { saveToLibrary } from '../src/services/libraryService';

export default function Dimensions() {
  const router = useRouter();
  const images = getInputImages();

  const [itemName, setItemName] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [depth, setDepth] = useState('');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!images || images.length === 0) {
      Alert.alert('Error', 'No images selected.');
      router.back();
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleGenerate = async () => {
    if (!images || images.length === 0) return;

    setIsGenerating(true);
    setStatusText('Uploading images...');

    try {
      const taskId = await startModelGeneration(images);
      setStatusText('Generating 3D model...');

      let elapsed = 0;
      pollingRef.current = setInterval(async () => {
        try {
          elapsed += 3;
          setStatusText(`Generating 3D model... (${elapsed}s)`);

          const result = await checkModelStatus(taskId);
          console.log('Poll result:', JSON.stringify(result));

          if (result.status === 'success') {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setIsGenerating(false);
            
            if (result.modelUrl) {
              const w = parseFloat(width);
              const h = parseFloat(height);
              const d = parseFloat(depth);
              const hasDims = !isNaN(w) || !isNaN(h) || !isNaN(d);
              
              const dims = hasDims ? {
                width: isNaN(w) ? 0 : w,
                height: isNaN(h) ? 0 : h,
                depth: isNaN(d) ? 0 : d
              } : null;

              setModelUrl(result.modelUrl, dims);

              // Save to local library
              const frontImage = images.find(img => img.type === 'front') || images[0];
              try {
                await saveToLibrary({
                  name: itemName || 'Untitled Furniture',
                  thumbnailUri: frontImage.uri,
                  modelUrl: result.modelUrl,
                  dimensions: dims || { width: 0, height: 0, depth: 0 },
                  unit,
                });
              } catch (saveErr) {
                console.warn('Failed to save to library:', saveErr);
              }

              router.push({
                pathname: '/viewer',
                params: { width: width || '0', height: height || '0', depth: depth || '0' },
              });
            } else {
              Alert.alert('Model Ready', 'Generation succeeded but no download URL was returned.');
            }
          } else if (result.status === 'failed') {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setIsGenerating(false);
            Alert.alert('Generation Failed', 'The 3D model generation failed. Please try again.');
          }

          if (elapsed >= 120) {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setIsGenerating(false);
            Alert.alert('Timeout', 'Model generation is taking too long. Please try again.');
          }
        } catch (pollError: any) {
          console.error('Poll error:', pollError);
        }
      }, 3000);
    } catch (error: any) {
      setIsGenerating(false);
      console.error('Generation error:', error);
      Alert.alert('Generation Failed', error.message || 'Something went wrong.');
    }
  };

  if (isGenerating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingTitle}>Generating 3D Model</Text>
        <Text style={styles.loadingSubtitle}>{statusText}</Text>
        <Text style={styles.loadingHint}>This typically takes 2-3 minutes.{"\n"}Please don't close the app.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <Text style={styles.title}>Set Dimensions</Text>
      <Text style={styles.subtitle}>Review your captures and specify the physical scale.</Text>

      {/* Horizontal Image Gallery */}
      {images && images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery} contentContainerStyle={styles.galleryContent}>
          {images.map((img, idx) => (
            <View key={idx} style={styles.galleryCard}>
              <Image source={{ uri: img.uri }} style={styles.galleryImage} />
              <View style={styles.galleryBadge}>
                <Text style={styles.galleryBadgeText}>{img.type.charAt(0).toUpperCase() + img.type.slice(1)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Item Name */}
      <Text style={styles.fieldLabel}>Item Name</Text>
      <TextInput
        style={styles.nameInput}
        placeholder="e.g. Leather Sofa, Wooden Chair"
        placeholderTextColor="#94a3b8"
        value={itemName}
        onChangeText={setItemName}
      />

      {/* Dimensions Card */}
      <View style={styles.dimsCard}>
        {/* Unit Toggle */}
        <View style={styles.unitRow}>
          <View style={styles.unitToggle}>
            <TouchableOpacity
              style={[styles.unitBtn, unit === 'in' && styles.unitBtnActive]}
              onPress={() => setUnit('in')}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitText, unit === 'in' && styles.unitTextActive]}>Inches</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitBtn, unit === 'cm' && styles.unitBtnActive]}
              onPress={() => setUnit('cm')}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitText, unit === 'cm' && styles.unitTextActive]}>CM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.dimsRow}>
          <View style={styles.dimField}>
            <Text style={styles.dimLabel}>Width</Text>
            <View style={styles.dimInputWrap}>
              <TextInput
                style={styles.dimInput}
                placeholder="0"
                placeholderTextColor="#c6c6cd"
                keyboardType="numeric"
                value={width}
                onChangeText={setWidth}
              />
              <Text style={styles.dimUnit}>{unit}</Text>
            </View>
          </View>
          <View style={styles.dimField}>
            <Text style={styles.dimLabel}>Height</Text>
            <View style={styles.dimInputWrap}>
              <TextInput
                style={styles.dimInput}
                placeholder="0"
                placeholderTextColor="#c6c6cd"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
              <Text style={styles.dimUnit}>{unit}</Text>
            </View>
          </View>
          <View style={styles.dimField}>
            <Text style={styles.dimLabel}>Depth</Text>
            <View style={styles.dimInputWrap}>
              <TextInput
                style={styles.dimInput}
                placeholder="0"
                placeholderTextColor="#c6c6cd"
                keyboardType="numeric"
                value={depth}
                onChangeText={setDepth}
              />
              <Text style={styles.dimUnit}>{unit}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Generate Button */}
      <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} activeOpacity={0.85}>
        <Text style={styles.generateText}>Generate 3D Model</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9ff' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#0b1c30', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#45464d', marginBottom: 24, lineHeight: 20 },

  // Gallery
  gallery: { marginBottom: 28, marginHorizontal: -20 },
  galleryContent: { paddingHorizontal: 20, gap: 12 },
  galleryCard: { width: 260, height: 200, borderRadius: 16, overflow: 'hidden', backgroundColor: '#e5eeff', position: 'relative' },
  galleryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  galleryBadge: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  galleryBadgeText: { fontSize: 13, fontWeight: '600', color: '#0b1c30' },

  // Item Name
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#0b1c30', marginBottom: 8 },
  nameInput: {
    width: '100%', height: 52, backgroundColor: '#ffffff', borderRadius: 12,
    borderWidth: 1, borderColor: '#c6c6cd', paddingHorizontal: 16,
    fontSize: 15, color: '#0b1c30', marginBottom: 24,
  },

  // Dimensions Card
  dimsCard: {
    width: '100%', backgroundColor: '#ffffff', borderRadius: 16, padding: 20,
    marginBottom: 32, borderWidth: 1, borderColor: '#e5eeff',
  },
  unitRow: { alignItems: 'center', marginBottom: 20 },
  unitToggle: { flexDirection: 'row', backgroundColor: '#e5eeff', borderRadius: 20, padding: 3 },
  unitBtn: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 18 },
  unitBtnActive: { backgroundColor: '#000000' },
  unitText: { fontSize: 14, fontWeight: '600', color: '#76777d' },
  unitTextActive: { color: '#ffffff' },
  dimsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  dimField: { flex: 1, alignItems: 'center' },
  dimLabel: { fontSize: 13, fontWeight: '500', color: '#45464d', marginBottom: 8 },
  dimInputWrap: {
    width: '100%', height: 48, backgroundColor: '#f8f9ff', borderRadius: 12,
    borderWidth: 1, borderColor: '#e5eeff', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12,
  },
  dimInput: { flex: 1, fontSize: 18, fontWeight: '600', color: '#0b1c30', textAlign: 'center' },
  dimUnit: { fontSize: 14, color: '#76777d', marginLeft: 4 },

  // Generate Button
  generateBtn: {
    width: '100%', height: 60, backgroundColor: '#000000', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  generateText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },

  // Loading State
  loadingContainer: { flex: 1, backgroundColor: '#f8f9ff', justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingTitle: { fontSize: 22, fontWeight: '700', color: '#0b1c30', marginTop: 24, marginBottom: 8 },
  loadingSubtitle: { fontSize: 16, color: '#45464d', textAlign: 'center' },
  loadingHint: { fontSize: 14, color: '#76777d', marginTop: 16, textAlign: 'center', lineHeight: 22 },
});
