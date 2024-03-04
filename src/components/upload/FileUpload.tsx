import { useEffect, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';
import { FileProgress } from '@/components/upload/FileProgress.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import FileService from '@/service/file.service.ts';
import { UploadProgressType } from '@/lib/types.ts';

const fs = new FileService();

export const FileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType>({});
  const {
    hasSubmitted,
    setHasSubmit,
    uploadList,
    alreadyUploaded,
    setAlreadyUploadList,
    removeFile
  } = useFileStore();

  useEffect(() => {
    fs.onProgress((progress) => setUploadProgress(progress));

    if (uploadList && hasSubmitted) {
      fs.startUploading(uploadList).then();
    }

    return () => {
      fs.offProgress((progress) => setUploadProgress(progress));
    };
  }, [
    uploadList,
    hasSubmitted,
    setHasSubmit,
    alreadyUploaded,
    removeFile,
    setAlreadyUploadList
  ]);

  return (
    <ScrollArea className="max-h-96 w-full flex flex-col gap-4 text-primary pr-5">
      {uploadList.length >= 1 && (
        <h1 className="text-lg font-semibold">Uploading</h1>
      )}
      {[...uploadList].map((file) => (
        <FileProgress
          file={file}
          value={uploadProgress[file.name] || 0}
          key={`${file.name}_${file.lastModified}`}
        />
      ))}
      {alreadyUploaded.length >= 1 && (
        <h1 className="text-lg font-semibold">Uploaded</h1>
      )}
      {[...alreadyUploaded].map((file) => (
        <FileProgress
          file={file}
          value={100}
          key={`${file.name}_${file.lastModified}`}
        />
      ))}
    </ScrollArea>
  );
};
