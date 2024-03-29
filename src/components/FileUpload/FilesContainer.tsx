import { useFileStore } from '@/stores/file.store.ts';
import { FileRow } from '@/components/FileUpload/FileRow.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';

export const FilesContainer = ({
  inputFileRef,
}: {
  inputFileRef: React.RefObject<HTMLInputElement>;
}) => {
  const { uploadList } = useFileStore();

  return (
    <ScrollArea className="max-h-96 w-full flex flex-col gap-4 text-primary">
      {[...uploadList].map((file) => (
        <FileRow
          inputFileRef={inputFileRef}
          file={file}
          value={0}
          key={`${file.name}_${file.lastModified}`}
        />
      ))}
    </ScrollArea>
  );
};
