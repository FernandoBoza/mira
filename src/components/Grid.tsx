import { Card, CardContent, CardFooter } from '@/components/ui/card.tsx';
import { FilePreview } from '@/components/FilePreview';
import { formatBytes, getFileFormat, getFileName } from '@/lib/utils.ts';

type GalleryProps = {
  files: File[] | FileList;
  className?: string;
  selectFile?: (file?: File) => void;
  selectedFileName?: string;
};
export const Grid = ({ files, selectFile, selectedFileName, className = '' }: GalleryProps) => {
  const handleFileSelection = (file: File) => {
    if (selectedFileName === file.name) {
      selectFile && selectFile(undefined);
      return '';
    } else {
      selectFile && selectFile(file);
      return file.name;
    }
  };

  return (
    <div className={`grid grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {[...files].map((file) => (
        <Card
          key={`${file.name}`}
          onClick={() => handleFileSelection(file)}
          className={`overflow-hidden flex flex-col justify-between cursor-pointer ${file.name === selectedFileName ? 'bg-primary/20' : ''}`}
        >
          <CardContent className="h-full max-h-48 xl:h-60 overflow-hidden px-0">
            <FilePreview disablePlayBack={true} file={file} />
          </CardContent>
          <CardFooter className={'p-3 flex flex-col items-start'}>
            <b className="text-ellipsis overflow-hidden text-nowrap w-full">
              {getFileName(file.name)}
            </b>
            <p className="flex justify-between w-full">
              {formatBytes(file.size)}
              <span className="text-muted-foreground">{getFileFormat(file.type)}</span>
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
