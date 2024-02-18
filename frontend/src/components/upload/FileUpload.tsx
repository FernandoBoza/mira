import { useEffect, useState } from 'react';
import { FileUploadIcon } from '@/assets/icons.tsx';
import { useFileStore } from '@/stores/file.store.ts';
import { Progress } from '@/components/ui/progress.tsx';
import { formatBytes } from '../../../../utils';

type FileUploadProgressProps = {
  fileList: FileList;
};

export const FileUpload = ({ fileList }: FileUploadProgressProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const ProgressProps = ({ file }: { file: File }) => (
    <p className="flex justify-between gap-3">
      <span id="fileName">{file.name.slice(0, 20)}... </span>
      <span id="fileSize">{formatBytes(file.size)}</span>
    </p>
  );

  return (
    <div className="flex gap-4 items-center pt-2 border-t w-full text-primary">
      {FileUploadIcon}
      <div className="w-full">
        {[...fileList].map((file, index) => (
          <Progress
            key={`${file.name}_${index}`}
            value={uploadProgress}
            children={<ProgressProps file={file} />}
          />
        ))}
      </div>
    </div>
  );
};
