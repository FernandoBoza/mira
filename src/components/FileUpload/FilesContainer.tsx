import { useFileStore } from '@/stores/file.store.ts';
import { FileRow } from '@/components/FileUpload/FileRow.tsx';

type FilesContainerProps = {
  inputFileRef: React.RefObject<HTMLInputElement>;
};

export const FilesContainer = ({ inputFileRef }: FilesContainerProps) => {
  const { uploadList } = useFileStore();

  return [...uploadList].map((file) => (
    <FileRow
      inputFileRef={inputFileRef}
      file={file}
      value={0}
      key={`${file.name}_${file.lastModified}`}
    />
  ));
};
