import { ReactNode } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { formatBytes, getFileType } from '@/lib/utils.ts';
import { useFileStore } from '@/stores/file.store.ts';
import { AudioIcon, CloseIcon, DocumentIcon, PhotoIcon, VideoIcon } from '@/assets/icons.tsx';

export const FileRow = ({ file, value, inputFileRef }: FileProgressProps) => {
  const { name, size, type } = file;
  const fileName = name.length > 60 ? `${name.slice(0, 60)} ...` : name;
  const fileIcon = MediaIcon[getFileType(type)];
  const removeFile = useFileStore((state) => state.removeFile);
  const progressStatusStyle = value >= 100 ? 'opacity-50 pointer-events-none mb-5' : 'mb-5';

  const handleRemoveFile = (file: File) => {
    removeFile(file);
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  return (
    <div className={progressStatusStyle}>
      <div className="flex items-center gap-3 mb-1">
        <i>{fileIcon}</i>
        {value < 100 && (
          <Button
            variant={'ghost'}
            className={'h-auto p-0 hover:bg-red-700 hover:text-white'}
            onClick={() => handleRemoveFile(file)}
          >
            {CloseIcon}
          </Button>
        )}
        <span id="fileName" className="line-clamp-1">
          {fileName}
        </span>
        <span className="font-bold ml-auto mr-2 text-nowrap" id="fileSize">
          {formatBytes(size)}
        </span>
      </div>
    </div>
  );
};

const MediaIcon: MediaIconType = {
  image: PhotoIcon,
  video: VideoIcon,
  audio: AudioIcon,
  application: DocumentIcon,
};

type FileProgressProps = {
  file: File;
  value: number;
  inputFileRef: React.RefObject<HTMLInputElement>;
};

type MediaIconType = {
  image: ReactNode;
  video: ReactNode;
  [key: string]: ReactNode;
};
