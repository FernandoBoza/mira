import { useEffect, useState } from 'react';

export const FileUploadProgress = ({ fileList }: { fileList: FileList }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bytes, setBytes] = useState(0);

  useEffect(() => {
    // Fetch API here
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

  const formatBytes = (bytes: number) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = 2 < 0 ? 0 : 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.floor(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)))} ${sizes[i]}`;
  };

  return (
    <>
      {fileList && (
        <>
          <div className="fileName">
            <p>
              <span id="fileName">{fileList[0].name}</span>
              <span id="fileSize">{formatBytes(bytes)}</span>
            </p>
            <progress
              value={uploadProgress}
              id="progressBar"
              max="100"
            ></progress>
          </div>
        </>
      )}
    </>
  );
};
