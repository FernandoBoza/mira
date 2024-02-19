import { useEffect, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';
import { FileProgress } from '@/components/upload/FileProgress.tsx';

export const FileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { hasSubmitted, setHasSubmit, fileList } = useFileStore(
    (state) => state,
  );

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

  return (
    //flex gap-4 items-center pt-2 border-t w-full text-primary
    <div className="w-full flex flex-col gap-4 text-primary">
      {[...fileList].map((file) => (
        <FileProgress
          file={file}
          key={`${file.name}_${file.lastModified}`}
          value={uploadProgress}
        />
      ))}
    </div>
  );
};
