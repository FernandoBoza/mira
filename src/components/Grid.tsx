import { Card, CardContent, CardFooter } from '@/components/ui/card.tsx';
import { FilePreview } from '@/components/FilePreview';
import { formatBytes, getFileFormat, getFileName } from '@/lib/utils.ts';
import { useFileStore } from '@/stores/file.store.ts';

type GalleryProps = {
  files: File[] | FileList;
  selectFile?: (file?: File) => void;
  selectedFileName?: string;
  showFileDetails?: boolean;
  draggable?: boolean;
};
export const Grid = ({
  files,
  selectFile,
  selectedFileName,
  showFileDetails,
  draggable,
}: GalleryProps) => {
  const { setDraggedFile } = useFileStore();

  const handleFileSelection = (file: File) => {
    if (selectedFileName === file.name) {
      selectFile && selectFile(undefined);
      return '';
    } else {
      selectFile && selectFile(file);
      return file.name;
    }
  };

  const handleDragStart = (file: File) => {
    setDraggedFile(file);
  };

  return (
    <div className={`grid ${showFileDetails ? 'grid-cols-4 xl:grid-cols-5' : 'grid-cols-2'}  gap-4`}>
      {[...files].map((file) => (
        <Card
          key={`${file.name}`}
          onClick={() => handleFileSelection(file)}
          draggable={draggable}
          onDragStart={() => {
            if (draggable) handleDragStart(file);
          }}
          className={`overflow-hidden flex flex-col justify-between cursor-pointer ${file.name === selectedFileName ? 'bg-primary/20' : ''}`}
        >
          <CardContent
            className={`${showFileDetails ? 'h-full max-h-48 xl:h-60' : 'p-0'} overflow-hidden px-0`}
          >
            <FilePreview disablePlayBack={true} file={file} />
          </CardContent>
          {showFileDetails && (
            <CardFooter className={'p-3 flex flex-col items-start'}>
              <b className="text-ellipsis overflow-hidden text-nowrap w-full">
                {getFileName(file.name)}
              </b>
              <p className="flex justify-between w-full">
                {formatBytes(file.size)}
                <span className="text-muted-foreground">{getFileFormat(file.type)}</span>
              </p>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};
