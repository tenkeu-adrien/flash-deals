// ============================================
// FIREBASE STORAGE
// ============================================

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  UploadTask
} from 'firebase/storage';
import { storage } from './config';
import { getCurrentUserId } from './auth';

// ============================================
// UPLOAD
// ============================================

/**
 * Upload une image
 */
export async function uploadImage(
  file: File,
  folder = 'images'
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    // Générer un nom unique
    const timestamp = Date.now();
    const fileName = `${folder}/${userId}/${timestamp}_${file.name}`;

    // Référence du fichier
    const storageRef = ref(storage, fileName);

    // Upload
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('✅ Image uploadée:', downloadURL);
    return {
      success: true,
      url: downloadURL,
      path: fileName
    };
  } catch (error: any) {
    console.error('❌ Erreur upload:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload plusieurs images
 */
export async function uploadMultipleImages(
  files: File[],
  folder = 'images'
): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    const uploadPromises = Array.from(files).map((file) => uploadImage(file, folder));

    const results = await Promise.all(uploadPromises);

    const urls = results.filter((r) => r.success).map((r) => r.url!);

    console.log(`✅ ${urls.length} images uploadées`);
    return { success: true, urls };
  } catch (error: any) {
    console.error('❌ Erreur upload multiple:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload avec progression
 */
export function uploadWithProgress(
  file: File,
  folder = 'images',
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('Utilisateur non connecté');

      const timestamp = Date.now();
      const fileName = `${folder}/${userId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          reject({ success: false, error: error.message });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            success: true,
            url: downloadURL,
            path: fileName
          });
        }
      );
    } catch (error: any) {
      reject({ success: false, error: error.message });
    }
  });
}

// ============================================
// DELETE
// ============================================

/**
 * Supprimer une image
 */
export async function deleteImage(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);

    console.log('✅ Image supprimée');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur suppression:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Supprimer plusieurs images
 */
export async function deleteMultipleImages(filePaths: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    const deletePromises = filePaths.map((path) => {
      const storageRef = ref(storage, path);
      return deleteObject(storageRef);
    });

    await Promise.all(deletePromises);

    console.log(`✅ ${filePaths.length} images supprimées`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur suppression multiple:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// HELPERS
// ============================================

/**
 * Obtenir l'URL de téléchargement
 */
export async function getDownloadUrl(filePath: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const storageRef = ref(storage, filePath);
    const url = await getDownloadURL(storageRef);

    return { success: true, url };
  } catch (error: any) {
    console.error('❌ Erreur récupération URL:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les métadonnées
 */
export async function getFileMetadata(filePath: string): Promise<{ success: boolean; metadata?: any; error?: string }> {
  try {
    const storageRef = ref(storage, filePath);
    const metadata = await getMetadata(storageRef);

    return { success: true, metadata };
  } catch (error: any) {
    console.error('❌ Erreur récupération métadonnées:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Lister les fichiers d'un dossier
 */
export async function listFiles(folder: string): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const storageRef = ref(storage, folder);
    const result = await listAll(storageRef);

    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);

        return {
          name: itemRef.name,
          path: itemRef.fullPath,
          url,
          size: metadata.size,
          contentType: metadata.contentType,
          created: metadata.timeCreated
        };
      })
    );

    return { success: true, files };
  } catch (error: any) {
    console.error('❌ Erreur listage fichiers:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// VALIDATION
// ============================================

/**
 * Valider le type de fichier
 */
export function validateFileType(
  file: File,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Valider la taille du fichier (en MB)
 */
export function validateFileSize(file: File, maxSizeMB = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Valider un fichier
 */
export function validateFile(
  file: File,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
): { valid: boolean; error?: string } {
  if (!validateFileType(file, allowedTypes)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
    };
  }

  if (!validateFileSize(file, maxSizeMB)) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Taille max: ${maxSizeMB}MB`
    };
  }

  return { valid: true };
}

// ============================================
// COMPRESSION
// ============================================

/**
 * Compresser une image avant upload
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  quality = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionner si nécessaire
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });

            console.log(
              `✅ Image compressée: ${(file.size / 1024).toFixed(2)}KB → ${(
                compressedFile.size / 1024
              ).toFixed(2)}KB`
            );
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
      img.src = e.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload avec compression automatique
 */
export async function uploadCompressedImage(
  file: File,
  folder = 'images',
  maxWidth = 1920,
  quality = 0.8
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
  try {
    // Valider le fichier
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Compresser
    const compressedFile = await compressImage(file, maxWidth, quality);

    // Upload
    return await uploadImage(compressedFile, folder);
  } catch (error: any) {
    console.error('❌ Erreur upload compressé:', error);
    return { success: false, error: error.message };
  }
}
