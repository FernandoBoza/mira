import { useEffect, useState } from 'react';
import { FileUploadIcon } from '@/assets/icons.tsx';
import { formatBytes } from '../../../../utils';

type FileUploadProgressProps = {
  fileList: FileList;
};

export const FileUploadProgress = ({ fileList }: FileUploadProgressProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bytes, setBytes] = useState(0);

  useEffect(() => {
    // TODO Fetch API here
    const simulateUpload = async () => {
      let progress = 0;
      while (progress <= 100) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        progress += 10;
        setUploadProgress(progress);
      }
    };

    if (fileList) {
      simulateUpload()
        .then()
        .finally(() => console.log('done'));
    }

    setBytes(fileList[0].size);
  }, [fileList]);

  return (
    <div className="flex gap-4 items-center mt-4 pt-4 border-t border-gray-200">
      {FileUploadIcon}
      <div className="fileName">
        <p>
          <span id="fileName">{fileList[0].name}</span>
          <span id="fileSize">{formatBytes(bytes)}</span>
        </p>
        <progress value={uploadProgress} id="progressBar" max="100"></progress>
      </div>
    </div>
  );
};
