import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Clock, Trash2 } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { 
  getLibraryItems, 
  deleteFromLibrary, 
  formatRelativeTime, 
  formatDimensions,
  LibraryItem 
} from '../../src/services/libraryService';
import { setModelUrl } from '../../src/store/modelStore';

export default function HistoryScreen() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Reload library every time the tab is focused
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    setLoading(true);
    const data = await getLibraryItems();
    setItems(data);
    setLoading(false);
  };

  const handleDelete = (item: LibraryItem) => {
    Alert.alert(
      'Delete Item',
      `Remove "${item.name}" from your library?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteFromLibrary(item.id);
            loadItems(); // Refresh
          },
        },
      ]
    );
  };

  const handleOpenItem = (item: LibraryItem) => {
    // Set the model URL in the store and navigate to the viewer
    const dims = {
      width: item.dimensions.width,
      height: item.dimensions.height,
      depth: item.dimensions.depth,
    };
    setModelUrl(item.modelUrl, dims);
    router.push({
      pathname: '/viewer',
      params: {
        width: String(dims.width),
        height: String(dims.height),
        depth: String(dims.depth),
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Filter Row */}
      <View style={styles.filterRow}>
        <View style={styles.chipActive}>
          <Text style={styles.chipTextActive}>All Items</Text>
        </View>
      </View>

      {/* Items Grid */}
      {!loading && items.length === 0 ? (
        <View style={styles.emptyState}>
          <Clock size={48} color="#c6c6cd" />
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptySubtitle}>Generate your first 3D model{"\n"}to see it here!</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {items.map(item => (
            <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8} onPress={() => handleOpenItem(item)}>
              <View style={styles.cardImageWrap}>
                <Image source={{ uri: item.thumbnailUri }} style={styles.cardImage} />
                {/* Delete button overlay */}
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(item);
                  }}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Trash2 size={14} color="#ba1a1a" />
                </TouchableOpacity>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardDims}>{formatDimensions(item.dimensions, item.unit)}</Text>
                  <Text style={styles.cardTime}>{formatRelativeTime(item.createdAt)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  chipActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#000000',
  },
  chipTextActive: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0b1c30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageWrap: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#e5eeff',
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    padding: 12,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0b1c30',
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDims: {
    fontSize: 12,
    color: '#76777d',
  },
  cardTime: {
    fontSize: 12,
    color: '#76777d',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#45464d',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#76777d',
    textAlign: 'center',
    lineHeight: 22,
  },
});
