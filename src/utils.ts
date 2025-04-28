import { Image } from 'react-native';
import type {
  FileAssetSource,
  PropertyType,
  RiveAssetPropType,
  RiveRGBA,
} from './types';

function parsePossibleSources(source: RiveAssetPropType): FileAssetSource {
  if (typeof source === 'number') {
    const resolvedAsset = Image.resolveAssetSource(source);
    if (resolvedAsset && resolvedAsset.uri) {
      return { sourceAssetId: resolvedAsset.uri };
    } else {
      throw new Error('Invalid asset source provided.');
    }
  }

  const uri = (source as any).uri;
  if (typeof source === 'object' && uri) {
    return { sourceUrl: uri };
  }

  const asset = (source as any).fileName;
  const path = (source as any).path;

  if (typeof source === 'object' && asset) {
    const result: FileAssetSource = { sourceAsset: asset };

    if (path) {
      result.path = path;
    }

    return result;
  }

  throw new Error('Invalid source provided.');
}

function parseColor(color: string): RiveRGBA {
  const hex = color.replace(/^#/, '');

  let r = 0,
    g = 0,
    b = 0,
    a = 255;

  if (hex.length === 6) {
    // Format: RRGGBB
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (hex.length === 8) {
    // Format: RRGGBBAA
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    a = parseInt(hex.slice(6, 8), 16);
  } else {
    console.warn(`Invalid hex color: ${color}`);
  }

  return { r, g, b, a };
}
export { parsePossibleSources, parseColor };

export const getPropertyTypeString = (propertyType: PropertyType): string => {
  return propertyType; // Since PropertyType values are strings
};
