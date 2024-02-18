import { Dispatch, DragEvent, useCallback } from 'react';
import { DocumentIcon } from '../../assets/icons.tsx';

type DropZoneProps = {
  onFileDrop: Dispatch<FileList>;
};

export const DropZone = ({ onFileDrop }: DropZoneProps) => {
  const preventDefaults = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      preventDefaults(e);
      let files = e.dataTransfer.files;
      onFileDrop(files);
    },
    [onFileDrop, preventDefaults],
  );

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
    </div>
  );
};
