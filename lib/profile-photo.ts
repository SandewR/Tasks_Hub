import { File, Paths } from 'expo-file-system';
import type { ImagePickerAsset } from 'expo-image-picker';

function ownedFile(uri: string | null) {
  const name = uri?.split('/').pop() ?? '';
  if (!/^avatar-\d+-[a-z0-9]+\.(?:jpg|jpeg|png|webp|heic|heif|gif|bmp|avif)$/i.test(name)) return null;
  return new File(Paths.document, name);
}

export async function persistPhoto(asset: ImagePickerAsset) {
  const extension = /\.(jpg|jpeg|png|webp|heic|heif|gif|bmp|avif)(?:$|\?)/i.exec(asset.uri)?.[1]
    ?? /\.(jpg|jpeg|png|webp|heic|heif|gif|bmp|avif)$/i.exec(asset.fileName ?? '')?.[1]
    ?? 'jpg';
  const name = `avatar-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension.toLowerCase()}`;
  const destination = new File(Paths.document, name);
  await new File(asset.uri).copy(destination);
  return destination.uri;
}

export function loadPhotoUri(uri: string | null) {
  const file = ownedFile(uri);
  return file?.exists ? file.uri : null;
}

export function deletePhoto(uri: string | null) {
  try {
    const file = ownedFile(uri);
    if (file?.exists) file.delete();
  } catch {}
}
