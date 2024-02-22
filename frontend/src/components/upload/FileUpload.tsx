import { useEffect, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';
import { FileProgress } from '@/components/upload/FileProgress.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import FileService from '@/service/file.service.ts';
import { UploadProgressType } from '@/lib/types.ts';

export const FileUpload = () => {
  const fileService = new FileService();
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType>({});
  const { hasSubmitted, setHasSubmit, uploadFileList } = useFileStore(
    (state) => state,
  );

  useEffect(() => {
    if (uploadFileList && hasSubmitted) {
      fileService.setFiles(uploadFileList);
      fileService
        .uploadFiles()
        .then(() => setUploadProgress(fileService.getFileProgress()))
        .finally(() => setHasSubmit(false));
    }
  }, [uploadFileList, hasSubmitted]);

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
