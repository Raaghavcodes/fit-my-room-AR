/**
 * libraryService.ts
 * 
 * Manages a local library of previously generated 3D furniture models
 * using AsyncStorage for persistence across app launches.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const LIBRARY_KEY = '@furnishai_library';
const MAX_ITEMS = 50; // Keep the most recent 50 items

export interface LibraryItem {
  id: string;
  name: string;
  thumbnailUri: string;       // The "front" image URI used for generation
  modelUrl: string;           // Raw Tripo CDN URL for the .glb
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  unit: 'in' | 'cm';
  createdAt: number;          // Unix timestamp (ms)
}

/**
 * Get all saved library items, sorted newest first.
 */
export async function getLibraryItems(): Promise<LibraryItem[]> {
  try {
    const json = await AsyncStorage.getItem(LIBRARY_KEY);
    if (!json) return [];
    const items: LibraryItem[] = JSON.parse(json);
    return items.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Failed to load library:', error);
    return [];
  }
}

/**
 * Save a new item to the library.
 * Automatically trims to MAX_ITEMS if the list gets too long.
 */
export async function saveToLibrary(item: Omit<LibraryItem, 'id' | 'createdAt'>): Promise<LibraryItem> {
  try {
    const existing = await getLibraryItems();
    
    const newItem: LibraryItem = {
      ...item,
      id: `lib_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      createdAt: Date.now(),
    };

    const updated = [newItem, ...existing].slice(0, MAX_ITEMS);
    await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(updated));
    
    console.log(`Saved to library: ${newItem.name} (${newItem.id})`);
    return newItem;
  } catch (error) {
    console.error('Failed to save to library:', error);
    throw error;
  }
}

/**
 * Delete an item from the library by ID.
 */
export async function deleteFromLibrary(id: string): Promise<void> {
  try {
    const existing = await getLibraryItems();
    const filtered = existing.filter(item => item.id !== id);
    await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
    console.log(`Deleted from library: ${id}`);
  } catch (error) {
    console.error('Failed to delete from library:', error);
    throw error;
  }
}

/**
 * Clear the entire library.
 */
export async function clearLibrary(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LIBRARY_KEY);
    console.log('Library cleared');
  } catch (error) {
    console.error('Failed to clear library:', error);
  }
}

/**
 * Format a timestamp into a human-readable relative time string.
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format dimensions into a compact display string.
 */
export function formatDimensions(dims: { width: number; height: number; depth: number }, unit: string): string {
  return `${dims.width}x${dims.height}x${dims.depth} ${unit}`;
}
