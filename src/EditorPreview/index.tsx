type EditorPreviewProps = {
  fileSelected?: File;
  videoRef?: React.RefObject<HTMLVideoElement>;
  fileUrl?: string;
  handleLoadedMetadata?: () => void;
};

export const EditorPreview = ({
  fileSelected,
  videoRef,
  fileUrl,
  handleLoadedMetadata,
}: EditorPreviewProps) => {
  return (
    <div className="flex h-full w-full p-6 flex-grow">
      {fileSelected ? (
        <>
          {/*<video*/}
          {/*  ref={videoRef}*/}
          {/*  src={fileUrl}*/}
          {/*  onLoadedMetadata={handleLoadedMetadata}*/}
          {/*  controls*/}
          {/*  className="rounded-xl"*/}
          {/*/>*/}
          <h1>{fileSelected.name}</h1>
        </>
      ) : (
        <h1 className="flex h-full w-full items-center justify-center">Select a file to preview</h1>
      )}
    </div>
  );
};
