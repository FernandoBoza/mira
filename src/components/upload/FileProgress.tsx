import { ReactNode } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { formatBytes, getFileType } from '@/lib/utils.ts';
import { Progress } from '@/components/ui/progress.tsx';
import { useFileStore } from '@/stores/file.store.ts';
import { AudioIcon, CloseIcon, DocumentIcon, PhotoIcon, VideoIcon } from '@/assets/icons.tsx';

export const FileProgress = ({ file, value }: FileProgressProps) => {
  const { name, size, type } = file;
  const fileName = name.length > 60 ? `${name.slice(0, 60)} ...` : name;
  const fileIcon = MediaIcon[getFileType(type)];
  const removeFile = useFileStore((state) => state.removeFile);
  const progressStatusStyle = value >= 100 ? 'opacity-50 pointer-events-none mb-5' : 'mb-5';

  return (
    <div className={progressStatusStyle}>
      <div className="flex items-center gap-3 mb-1">
        <i>{fileIcon}</i>
        {value < 100 && (
          <Button
            variant={'ghost'}
            className={'h-auto p-0 hover:bg-red-700 hover:text-white'}
            onClick={() => removeFile(file)}
          >
            {CloseIcon}
          </Button>
        )}
        <span id="fileName">{fileName}</span>
        <span className="font-bold ml-auto mr-2" id="fileSize">
          {formatBytes(size)}
        </span>
      </div>
      <Progress value={value} />
    </div>
  );
};

const MediaIcon: MediaIconType = {
  image: PhotoIcon,
  video: VideoIcon,
  audio: AudioIcon,
  application: DocumentIcon
};

type FileProgressProps = {
  file: File;
  value: number;
};

type MediaIconType = {
  image: ReactNode;
  video: ReactNode;
  [key: string]: ReactNode;
};

