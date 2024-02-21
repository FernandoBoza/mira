import { useEffect, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';
import { FileProgress } from '@/components/upload/FileProgress.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios, { AxiosProgressEvent } from 'axios';
import { UPLOAD_ENDPOINT } from '../../../../utils/constants.ts';

export const FileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<{
    [k: string]: number;
  }>({});
  const { hasSubmitted, setHasSubmit, fileList } = useFileStore(
    (state) => state,
  );

  const uploadFiles = async (file: File) => {
    const formData = new FormData();
    formData.append(file.name, file);

    try {
      const res = await axios.post(UPLOAD_ENDPOINT, formData, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (!progressEvent.total) return;
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent?.total,
          );
          setUploadProgress((prevState) => ({
            ...prevState,
            [file.name]: percentCompleted,
          }));
        },
      });
      console.log(res.data);
    } catch (err) {
      return console.error(err);
    }
  };

  useEffect(() => {
    if (fileList && hasSubmitted) {
      [...fileList].forEach((file) => {
        uploadFiles(file).finally(() => setHasSubmit(false));
      });
    }
  }, [fileList, hasSubmitted]);

  return (
    <ScrollArea className="max-h-96 w-full flex flex-col gap-4 text-primary pr-5">
      {[...fileList].map((file) => (
        <FileProgress
          file={file}
          value={uploadProgress[file.name] || 0}
          key={`${file.name}_${file.lastModified}`}
        />
      ))}
    </ScrollArea>
  );
};
