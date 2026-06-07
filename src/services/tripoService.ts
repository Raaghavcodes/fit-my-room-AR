import * as FileSystem from 'expo-file-system/legacy';

const START_URL = process.env.EXPO_PUBLIC_START_GENERATION_URL || '';
const STATUS_URL = process.env.EXPO_PUBLIC_CHECK_STATUS_URL || '';

export interface TripoImageInput {
  uri: string;
  type: 'front' | 'back' | 'left' | 'right';
}

/**
 * Step 1: Upload images and start generation (returns taskId in ~3-10 seconds depending on image count)
 * For multiview, at least 'front' is required, plus up to 3 more angles.
 */
export async function startModelGeneration(images: TripoImageInput[]): Promise<string> {
  const imagesPayload = await Promise.all(
    images.map(async (img) => {
      const base64 = await FileSystem.readAsStringAsync(img.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const extension = img.uri.split('.').pop()?.toLowerCase() || 'png';
      const formatMap: Record<string, string> = {
        jpg: 'jpeg', jpeg: 'jpeg', png: 'png', webp: 'webp',
      };
      
      return {
        type: img.type,
        base64,
        format: formatMap[extension] || 'png'
      };
    })
  );

  const response = await fetch(START_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images: imagesPayload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed: ${response.status}`);
  }

  const data = await response.json();
  return data.taskId;
}

/**
 * Step 2: Check the status of a generation task (returns instantly)
 */
export async function checkModelStatus(taskId: string): Promise<{
  status: string;
  modelUrl: string | null;
}> {
  const response = await fetch(STATUS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Status check failed: ${response.status}`);
  }

  return await response.json();
}
