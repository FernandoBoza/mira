import { ChangeEvent, DragEvent, useCallback, useRef, useState } from 'react';
import { DocumentIcon } from '../../assets/icons.tsx';
import { FileUpload } from '@/components/upload/FileUpload.tsx';
import { Button } from '@/components/ui/button.tsx';

// type DropZoneProps = {
//   getFileList: Dispatch<FileList>;
// };

export const DropZone = () => {
  const [fileList, setFileList] = useState<FileList>();
  const [submit, setSubmit] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);

  const handleFileDrop = (files: FileList) => {
    files && setFileList(files);
  };

  const handleFileSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length) {
      setFileList(files);
    }
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

  const onButtonClick = () => {
    inputFile?.current?.click();
  };

  return (
    <div
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDrop={handleDrop}
      id="dropZone"
      className="p-4 border border-gray-300 rounded-lg flex flex-col items-center gap-4"
    >
      {DocumentIcon}
      <p>Drag & Drop Here or</p>
      <Button onClick={onButtonClick}>Browse</Button>

      {fileList && (
        <>
          <FileUpload submit={submit} fileList={fileList} />
          <Button className="self-start ml-10" onClick={() => setSubmit(true)}>
            Upload
          </Button>
        </>
      )}
      <input
        style={{ display: 'none' }}
        ref={inputFile}
        onChange={handleFileSelection}
        type="file"
        multiple
      />
    </div>
  );
};
