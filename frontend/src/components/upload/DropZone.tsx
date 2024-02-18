import { DragEvent, useCallback, useState } from 'react';
import { DocumentIcon } from '../../assets/icons.tsx';
import { FileUploadProgress } from '@/components/upload/FileUploadProgress.tsx';
import { Button } from '@/components/ui/button.tsx';

// type DropZoneProps = {
//   getFileList: Dispatch<FileList>;
// };

export const DropZone = () => {
  const [fileList, setFileList] = useState<FileList>();

  const handleFileDrop = (files: FileList) => {
    files && setFileList(files);
  };

  const preventDefaults = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      preventDefaults(e);
      let files = e.dataTransfer.files;
      handleFileDrop(files);
    },
    [handleFileDrop, preventDefaults],
  );

  console.log(fileList);

  return (
    <div
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDrop={handleDrop}
      className="dropzone"
    >
      {DocumentIcon}
      <p>
        Drag & Drop Here or <b>Browse</b>
      </p>

      <Button className="self-center">Upload Manifest</Button>
      {fileList && <FileUploadProgress fileList={fileList} />}
    </div>
  );
};
