// Simple shared state to pass large data between screens
// without going through URL params which can mangle special characters

import { TripoImageInput } from '../services/tripoService';

const PROXY_BASE = process.env.EXPO_PUBLIC_PROXY_MODEL_URL || '';

let _modelUrl: string | null = null;
let _rawModelUrl: string | null = null;
let _dimensions: { width: number; height: number; depth: number } | null = null;
let _inputImages: TripoImageInput[] = [];

export function setModelUrl(
  url: string,
  dimensions: { width: number; height: number; depth: number } | null = null
) {
  _rawModelUrl = url;
  _dimensions = dimensions;
  // Convert to proxy URL so model-viewer can load it (avoids CORS issues with Tripo CDN)
  _modelUrl = `${PROXY_BASE}?url=${encodeURIComponent(url)}`;
}

export function getModelUrl(): string | null {
  return _modelUrl;
}

export function getRawModelUrl(): string | null {
  return _rawModelUrl;
}

export function getDimensions(): { width: number; height: number; depth: number } | null {
  return _dimensions;
}


export function setInputImages(images: TripoImageInput[]) {
  _inputImages = images;
}

export function getInputImages(): TripoImageInput[] {
  return _inputImages;
}

export function clearModelStore() {
  _modelUrl = null;
  _rawModelUrl = null;
  _dimensions = null;
  _inputImages = [];
}
