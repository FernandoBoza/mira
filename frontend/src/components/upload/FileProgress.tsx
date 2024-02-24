import { Button } from '@/components/ui/button.tsx';
import { CloseIcon, MediaIcon } from '@/assets/icons.tsx';
import { Pause, Play, Square } from 'lucide-react';
import { formatBytes, getFileType } from '../../../../utils';
import { Progress } from '@/components/ui/progress.tsx';
import { useFileStore } from '@/stores/file.store.ts';
// import FileService from '@/service/file.service.ts';
import { useState } from 'react';

type FileProgressProps = {
  file: File;
  value: number;
};
// const fs = new FileService();

export const FileProgress = ({ file, value }: FileProgressProps) => {
  const [pauseResume, setPauseResume] = useState(false);

  const { name, size, type } = file;
  const fileName = name.length > 60 ? `${name.slice(0, 60)} ...` : name;
  const fileIcon = MediaIcon[getFileType(type)];
  const removeFile = useFileStore((state) => state.removeFile);

  const handlePause = () => {
    // fs.pauseUpload();
    setPauseResume(true);
  };

  const handleResume = () => {
    // fs.resumeUpload(file).then();
    setPauseResume(false);
  };

  const abortUpload = (): void => {
    // fs.pauseUpload();
    setPauseResume(false);
    // TODO: need to reset progress to 0
  };

  const playStyle = `group h-auto p-1 ${!pauseResume ? 'hidden' : 'block'}`;
  const pauseStyle = `group h-auto p-1 ${!pauseResume ? 'block' : 'hidden'}`;
  const progressStatusStyle =
    value >= 100 ? 'opacity-50 pointer-events-none mb-5' : 'mb-5';

  return (
    <div className={progressStatusStyle}>
      <div className="flex items-center gap-3 mb-1">
        <i>{fileIcon}</i>
        {value <= 100 && (
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
        {0 < value && value < 100 && (
          <>
            <Button
              variant={'ghost'}
              className={playStyle}
              onClick={handleResume}
            >
              <Play className="w-5 h-5 group-hover:stroke-primary fill-primary" />
            </Button>
            <Button
              variant={'ghost'}
              className={pauseStyle}
              onClick={handlePause}
            >
              <Pause className="w-5 h-5 group-hover:stroke-primary fill-primary" />
            </Button>
            <Button
              variant={'ghost'}
              className="group h-auto p-1"
              onClick={abortUpload}
            >
              <Square className="w-5 h-5 group-hover:stroke-primary fill-primary" />
            </Button>
          </>
        )}
      </div>
      <Progress value={value} />
    </div>
  );
};
