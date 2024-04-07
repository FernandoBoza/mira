import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { Timeline } from '@/components/Timeline';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';
import { Grid } from '@/components/Grid.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { EditorPreview } from '@/EditorPreview';

const EditorPage = () => {
  const { uploadList: files } = useFileStore();
  const memoizedFiles = useMemo(() => files, [files]);
  const [fileSelected, setFileSelected] = useState<File>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (fileSelected && ![...files].includes(fileSelected)) {
      setFileSelected(undefined);
    }
  }, [fileSelected, files]);

  const selectFile = useCallback((file?: File) => {
    setFileSelected(file);
  }, []);

  return (
    <ResizablePanelGroup direction="vertical" className="border">
      <ResizablePanel defaultSize={70}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20}>
            <ScrollArea className="flex h-full items-center justify-center p-6">
              <Grid draggable={true} files={memoizedFiles} />
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60}>
            <EditorPreview fileSelected={fileSelected} videoRef={videoRef} />
            <span>test</span>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20}>
            <div className="flex h-full justify-center p-6">
              <p>Effects</p>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30}>
        <Timeline selectFile={selectFile} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default EditorPage;
