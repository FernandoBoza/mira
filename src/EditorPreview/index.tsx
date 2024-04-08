import { useFileStore } from '@/stores/file.store.ts';

type EditorPreviewProps = {
  fileSelected?: File;
  videoRef?: React.RefObject<HTMLVideoElement>;
  fileUrl?: string;
  handleLoadedMetadata?: () => void;
};

export const EditorPreview = ({ fileSelected }: EditorPreviewProps) => {
  const { timeStamp } = useFileStore();
  return (
    <div className="flex h-full w-full p-6 flex-grow">
      {fileSelected ? (
        <>
          <h1>{fileSelected.name}</h1>
          <h5>{timeStamp}</h5>
        </>
      ) : (
        <h1 className="flex h-full w-full items-center justify-center">Select a file to preview</h1>
      )}
    </div>
  );
};
