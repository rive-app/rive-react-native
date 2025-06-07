/* eslint-disable no-bitwise */
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

  const resource = (source as any).resource;
  if (typeof source === 'object' && resource) {
    return { sourceResource: resource };
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

  const isValidHex = /^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex);
  if (!isValidHex) {
    console.warn(`Rive invalid hex color: ${color}`);
    return { r: 0, g: 0, b: 0, a: 255 };
  }

  let r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16),
    a = 255;

  // Optionally parse alpha channel if present
  if (hex.length === 8) {
    a = parseInt(hex.slice(6, 8), 16);
  }

  return { r, g, b, a };
}

function intToRiveRGBA(colorValue: number): RiveRGBA {
  const a = (colorValue >> 24) & 0xff;
  const r = (colorValue >> 16) & 0xff;
  const g = (colorValue >> 8) & 0xff;
  const b = colorValue & 0xff;
  return { r, g, b, a };
}

export { parsePossibleSources, parseColor, intToRiveRGBA };

export const getPropertyTypeString = (propertyType: PropertyType): string =>
  propertyType;
