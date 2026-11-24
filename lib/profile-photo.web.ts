import type { ImagePickerAsset } from 'expo-image-picker';

export async function persistPhoto(asset: ImagePickerAsset): Promise<string> {
  if (!asset.file && asset.uri.startsWith('data:image/')) return asset.uri;
  if (!asset.file) throw new Error('Choose the image again before saving.');
  if (asset.file.size > 2 * 1024 * 1024) throw new Error('On web, choose a photo smaller than 2 MB.');
  const file = asset.file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string'
      ? resolve(reader.result)
      : reject(new Error('The selected photo could not be read.'));
    reader.onerror = () => reject(new Error('The selected photo could not be read.'));
    reader.readAsDataURL(file);
  });
}

export function loadPhotoUri(uri: string | null) {
  return uri?.startsWith('data:image/') ? uri : null;
}

export function deletePhoto(_uri: string | null) {}
