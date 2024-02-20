import { Card, CardContent, CardFooter } from '@/components/ui/card.tsx';
import { FilePreview } from '@/components/FilePreview';
import { formatBytes, getFileFormat, getFileName } from '../../../utils';

type GalleryProps = {
  files: File[] | FileList;
  className?: string;
};
export const Gallery = ({ files, className = '' }: GalleryProps) => (
  <div className={`gap-2 grid grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
    {[...files].map((file) => (
      <Card
        key={`${file.name}`}
        className={'overflow-hidden flex flex-col justify-between'}
      >
        <CardContent className="p-0 max-h-40 xl:h-60 overflow-hidden">
          <FilePreview file={file} />
        </CardContent>
        <CardFooter className={'p-3 flex flex-col items-start'}>
          <b className="text-ellipsis overflow-hidden text-nowrap w-full">
            {getFileName(file.name)}
          </b>
          <p className="flex justify-between w-full">
            {formatBytes(file.size)}
            <span className="text-muted-foreground">
              {getFileFormat(file.type)}
            </span>
          </p>
        </CardFooter>
      </Card>
    ))}
  </div>
);
