import { useEffect, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';
import { FileProgress } from '@/components/upload/FileProgress.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import FileService from '@/service/file.service.ts';
import { UploadProgressType } from '@/lib/types.ts';

const fs = new FileService();

export const FileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType>({});
  const { hasSubmitted, setHasSubmit, uploadFileList } = useFileStore(
    (state) => state,
  );

  useEffect(() => {
    const handleProgress = (progress: UploadProgressType) => {
      setUploadProgress(progress);
    };

    fs.onProgress(handleProgress);

    if (uploadFileList && hasSubmitted) {
      fs.setFiles(uploadFileList);
      fs.startUploading(true).finally(() => setHasSubmit(false));
    }

    return () => {
      fs.offProgress(handleProgress);
    };
  }, [uploadFileList, hasSubmitted, setHasSubmit]);

  return (
    <ScrollArea className="max-h-96 w-full flex flex-col gap-4 text-primary pr-5">
      {[...uploadFileList].map((file) => (
        <FileProgress
          file={file}
          value={uploadProgress[file.name] || 0}
          key={`${file.name}_${file.lastModified}`}
        />
      ))}
    </ScrollArea>
  );
};
