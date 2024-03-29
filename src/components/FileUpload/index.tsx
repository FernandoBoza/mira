import { ChangeEvent, DragEvent, useCallback, useRef } from 'react';
import { FilesContainer } from '@/components/FileUpload/FilesContainer.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useFileStore } from '@/stores/file.store.ts';
import { CloudUploadIcon } from '../../assets/icons.tsx';
import FileService from '@/service/file.service.ts';

const fs = new FileService();

export const FileUpload = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { uploadList, alreadyUploaded, setUploadList } = useFileStore();

  /**
   * @Description
   * Sets files to the state, while filtering out files that already exist in
   * the setUploadList and file types that are not supported
   * @param files - The files to be added from either dropping files or selecting files from the file input
   * */
  const addFiles = useCallback(
    (files: FileList | ChangeEvent<HTMLInputElement>) => {
      setUploadList(fs.filterFiles({ files, uploadList, alreadyUploaded }));
    },
    [alreadyUploaded, setUploadList, uploadList],
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
      className="w-full @container"
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex flex-col gap-2 @sm:gap-0 @sm:flex-row items-center justify-around w-full">
          <i className="text-primary h-12 w-12">{CloudUploadIcon}</i>
          <p className="font-semibold">Drag & Drop Here or</p>
          <Button onClick={() => inputFileRef?.current?.click()}>Browse</Button>
        </div>

        {[...uploadList].length >= 1 && <FilesContainer inputFileRef={inputFileRef} />}
        <input
          multiple
          type="file"
          ref={inputFileRef}
          onChange={addFiles}
          style={{ display: 'none' }}
          accept="image/*,video/*,application/pdf"
        />
      </div>
    </div>
  );
};
