import type { UploadMetadata } from 'firebase/storage';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

import { firebaseApp } from '@/src/shared/config/firebase';

interface IUploadSingleImageParams {
  file: Blob | File;
  storagePath: string;
  metadata: UploadMetadata;
  onProgress: (progress: number) => void;
  onComplete: (downloadURL: string) => void;
  onError: (error: Error) => void;
}

export function uploadSingleImage({
  file,
  storagePath,
  metadata,
  onProgress,
  onComplete,
  onError,
}: IUploadSingleImageParams): void {
  const storage = getStorage(firebaseApp);
  const imageRef = ref(storage, storagePath);
  const uploadTask = uploadBytesResumable(imageRef, file, metadata);

  uploadTask.on(
    'state_changed',
    snapshot => onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
    onError,
    () => getDownloadURL(uploadTask.snapshot.ref).then(onComplete),
  );
}
