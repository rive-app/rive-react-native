import { Image } from 'react-native';
import type { FileAssetSource, RiveAssetPropType } from './types';

function parsePossibleSources(source: RiveAssetPropType): FileAssetSource {
  if (typeof source === 'number') {
    const resolvedAsset = Image.resolveAssetSource(source);
    console.log(resolvedAsset);
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

export { parsePossibleSources };
