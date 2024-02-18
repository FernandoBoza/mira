import { ReactNode, useEffect, useState } from 'react';
import { CloseIcon, PhotoIcon, VideoIcon } from '@/assets/icons.tsx';
import { useFileStore } from '@/stores/file.store.ts';
import { Progress } from '@/components/ui/progress.tsx';
import { formatBytes } from '../../../../utils';
import { Button } from '@/components/ui/button.tsx';

type FileUploadProgressProps = {
  fileList: FileList;
};

export const FileUpload = ({ fileList }: FileUploadProgressProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileListState, setFileListState] = useState<File[]>(
    Array.from(fileList),
  );
  const { hasSubmitted, setHasSubmit } = useFileStore((state) => state);

  const uploadFileInChunks = async (file: File) => {
    const chunkSize = 1048576; // 1MB
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('chunkIndex', `${i}`);

      console.log(formData);
      // Replace with your API endpoint
      // await fetch('/upload-chunk', {
      //   method: 'POST',
      //   body: formData,
      // });
    }
  };

  const simulateUpload = async () => {
    let progress = 0;
    while (progress <= 100) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      progress += 10;
      setUploadProgress(progress);
    }
  };

  useEffect(() => {
    // TODO Fetch API here
    if (fileList && hasSubmitted) {
      [...fileList].forEach((file) => {
        uploadFileInChunks(file)
          .then(simulateUpload)
          .finally(() => setHasSubmit(false));
      });
    }
  }, [fileList, hasSubmitted]);

  type MediaIconType = {
    image: ReactNode;
    video: ReactNode;
    [key: string]: ReactNode;
  };

  const MediaIcon: MediaIconType = {
    image: PhotoIcon,
    video: VideoIcon,
  };

  // TODO: make it personal per file
  const progressStatusStyle =
    uploadProgress >= 100 ? 'opacity-50 pointer-events-none' : '';

  const removeFileFromUpload = (file: File) => {
    const newList = fileListState.filter((f) => f.name !== file.name);
    setFileListState(newList);
  };
  return (
    //flex gap-4 items-center pt-2 border-t w-full text-primary
    <div className="w-full flex flex-col gap-4 text-primary">
      {fileListState.map((file, index) => {
        const { name, size, type } = file;
        const fileName = name.length > 60 ? `${name.slice(0, 60)}...` : name;
        const fileIcon = MediaIcon[type?.split('/')[0]];
        return (
          <div className={progressStatusStyle} key={`${name}_${index}`}>
            <div className="flex items-center gap-3 mb-1">
              <i>{fileIcon}</i>
              {uploadProgress <= 100 && (
                <Button
                  variant={'ghost'}
                  className={'h-auto p-1 hover:bg-red-700 hover:text-white'}
                  onClick={() => removeFileFromUpload(file)}
                >
                  {CloseIcon}
                </Button>
              )}
              <span id="fileName">{fileName}</span>
              <span className="font-bold ml-auto" id="fileSize">
                {formatBytes(size)}
              </span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        );
      })}
    </div>
  );
};
