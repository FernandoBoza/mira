import { useEffect, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';
import { FileProgress } from '@/components/upload/FileProgress.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';

export const FileUpload = () => {
  const uploadURL = 'http://localhost:3000/media/upload';
  const [uploadProgress, setUploadProgress] = useState(0);
  const { hasSubmitted, setHasSubmit, fileList } = useFileStore(
    (state) => state,
  );

  // const uploadFiles = async (file: File) => {
  //   const formData = new FormData();
  //   formData.append(file.name, file);
  //
  //   try {
  //     const res = await fetch(uploadURL, {
  //       method: 'POST',
  //       body: formData,
  //     });
  //     const data = await res.json();
  //     // get progress
  //
  //     console.log(data);
  //   } catch (err) {
  //     return console.error(err);
  //   }
  // };

  const uploadFiles = async (file: File) => {
    const formData = new FormData();
    formData.append(file.name, file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadURL, true);

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(percentCompleted);
      }
    };

    xhr.onload = function () {
      if (this.status === 200) {
        console.log(JSON.parse(this.response));
      }
    };

    xhr.send(formData);
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
          key={`${file.name}_${file.lastModified}`}
          value={uploadProgress}
        />
      ))}
    </ScrollArea>
  );
};
