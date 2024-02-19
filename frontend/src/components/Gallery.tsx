import { FilePreview } from '@/components/FilePreview';

type GalleryProps = {
  files: File[] | FileList;
};
export const Gallery = ({ files }: GalleryProps) => (
  <div className="flex flex-wrap gap-2">
    {[...files].map((file) => (
      <FilePreview file={file} key={`${file.name}_${file.lastModified}`} />
    ))}
  </div>
);
