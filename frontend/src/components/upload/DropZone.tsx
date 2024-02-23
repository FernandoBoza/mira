import { DragEvent, useCallback, useRef } from 'react';
import { FileUpload } from '@/components/upload/FileUpload.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useFileStore } from '@/stores/file.store.ts';
import {
  CloudUploadIcon,
  FileUploadIcon,
  SpinnerLoader,
} from '../../assets/icons.tsx';
import FileService from '@/service/file.service.ts';

export const DropZone = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const fileService = new FileService();
  const { hasSubmitted, setHasSubmit, setUploadFileList, uploadFileList } =
    useFileStore((state) => state);

  /**
   * @Description
   * Sets files to the state, while filtering out files that already exist in
   * the setUploadFileList and file types that are not supported
   * @param files - The files to be added from either dropping files or selecting files from the file input
   * */
  const addFiles = useCallback(
    fileService.addFiles(uploadFileList, setUploadFileList),
    [uploadFileList, setUploadFileList],
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
      className="p-4 border border-gray-300 rounded-lg flex flex-col items-center gap-4 shadow-lg dark:shadow-white/10"
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDrop={handleDrop}
    >
      <i className="text-primary h-20 w-20">{CloudUploadIcon}</i>
      <p className="font-semibold">Drag & Drop Here or</p>
      <Button onClick={() => inputFileRef?.current?.click()}>Browse</Button>

      {uploadFileList.length >= 1 && (
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
        multiple
        type="file"
        ref={inputFileRef}
        onChange={addFiles}
        style={{ display: 'none' }}
        accept="image/*,video/*,application/pdf"
      />
    </div>
  );
};
