import { ChangeEvent, DragEvent, useCallback, useRef } from 'react';
import {
  CloudUploadIcon,
  FileUploadIcon,
  SpinnerLoader,
} from '../../assets/icons.tsx';
import { FileUpload } from '@/components/upload/FileUpload.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useFileStore } from '@/stores/file.store.ts';

export const DropZone = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { hasSubmitted, setHasSubmit, setFileList, fileList } = useFileStore(
    (state) => state,
  );

  /*
   * @Description
   * This function is used to set files to the state
   * @param files - The files to be added from either dropping files or selecting files from the file input
   * */
  const addFiles = useCallback(
    (files: FileList | ChangeEvent<HTMLInputElement>) => {
      const newFiles = files instanceof FileList ? files : files?.target?.files;

      if (newFiles) {
        const filteredList = [...newFiles].filter(
          (file) => ![...fileList].some((f) => f.name === file.name),
        );

        setFileList([...fileList, ...filteredList]);
      }
    },
    [fileList, setFileList],
  );

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
      <i className="text-primary h-20 w-20">{CloudUploadIcon}</i>
      <p className="font-semibold">Drag & Drop Here or</p>
      <Button onClick={() => inputFileRef?.current?.click()}>Browse</Button>

      {fileList.length >= 1 && (
        <>
          <FileUpload />
          <Button
            disabled={hasSubmitted}
            className="self-start"
            onClick={() => setHasSubmit(true)}
          >
            <i className={`mr-2 ${hasSubmitted && 'animate-spin'}`}>
              {hasSubmitted ? SpinnerLoader : FileUploadIcon}
            </i>
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
