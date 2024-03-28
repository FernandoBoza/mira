import { useFileStore } from '@/stores/file.store.ts';
import { FileProgress } from '@/components/upload/FileProgress.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';

export const FileUpload = ({ inputFileRef }: { inputFileRef: React.RefObject<HTMLInputElement> }) => {
  const { uploadList } = useFileStore();

  return (
    <ScrollArea className="max-h-96 w-full flex flex-col gap-4 text-primary">
      {[...uploadList].map((file) => (
        <FileProgress
          inputFileRef={inputFileRef}
          file={file}
          value={0}
          key={`${file.name}_${file.lastModified}`}
        />
      ))}
    </ScrollArea>
  );
};
