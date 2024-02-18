import { ChangeEvent, DragEvent, useCallback, useRef, useState } from 'react';
import { DocumentIcon } from '../../assets/icons.tsx';
import { FileUpload } from '@/components/upload/FileUpload.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useFileStore } from '@/stores/file.store.ts';

export const DropZone = () => {
  const [fileList, setFileList] = useState<FileList>();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { hasSubmitted, setSubmit } = useFileStore((state) => state);

  /*
   * @Description
   * This function is used to set files to the state
   * @param files - The files to be added from either dropping files or selecting files from the file input
   * */
  const addFiles = (files: FileList | ChangeEvent<HTMLInputElement>) => {
    if (files instanceof FileList) {
      setFileList(files);
    } else {
      const file = files?.target?.files;
      file && setFileList(file);
    }
  };

  const preventDefaults = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      preventDefaults(e);
      addFiles(e.dataTransfer.files);
    },
    [addFiles, preventDefaults],
  );

  return (
    <div
      id="dropZone"
      className="p-4 border border-gray-300 rounded-lg flex flex-col items-center gap-4"
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDrop={handleDrop}
    >
      <span className="text-primary">{DocumentIcon}</span>
      <p className="font-semibold">Drag & Drop Here or</p>
      <Button onClick={() => inputFileRef?.current?.click()}>Browse</Button>

      {fileList && (
        <>
          <FileUpload fileList={fileList} />
          <Button
            disabled={hasSubmitted}
            className="self-start ml-10"
            onClick={() => setSubmit(true)}
          >
            Upload
          </Button>
        </>
      )}
      <input
        style={{ display: 'none' }}
        ref={inputFileRef}
        onChange={addFiles}
        type="file"
        multiple
      />
    </div>
  );
};
