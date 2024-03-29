import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { Timeline } from '@/components/Timeline';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';
import { Grid } from '@/components/Grid.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

const EditorPage = () => {
  const { uploadList: files } = useFileStore();
  const memoizedFiles = useMemo(() => files, [files]);
  const [fileSelected, setFileSelected] = useState<File>();
  const videoRef = useRef<HTMLVideoElement>(null);
  // const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (fileSelected && ![...files].includes(fileSelected)) {
      setFileSelected(undefined);
    }
  }, [fileSelected, files]);

  const selectFile = useCallback((file?: File) => {
    setFileSelected(file);
  }, []);

  // const handleLoadedMetadata = () => {
  //   if (videoRef.current) {
  //     setDuration(videoRef.current.duration);
  //   }
  // };

  const handleScrub = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  // src from Blob file
  // const fileUrl = URL.createObjectURL(new Blob());

  return (
    <ResizablePanelGroup direction="vertical" className="border">
      <ResizablePanel defaultSize={70}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20}>
            <ScrollArea className="flex h-full items-center justify-center p-6">
              <Grid
                draggable={true}
                files={memoizedFiles}
                selectFile={selectFile}
                selectedFileName={fileSelected?.name}
              />
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full w-full p-6 flex-grow">
              {fileSelected ? (
                // <video
                //   ref={videoRef}
                //   src={fileUrl}
                //   onLoadedMetadata={handleLoadedMetadata}
                //   controls
                // />
                <h1>{fileSelected.name}</h1>
              ) : (
                <h1 className="flex h-full w-full items-center justify-center">
                  Select a file to preview
                </h1>
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20}>
            <div className="flex h-full justify-center">
              <p>Effects</p>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30}>
        <Timeline duration={100} onScrub={handleScrub} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default EditorPage;
