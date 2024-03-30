import { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid2X2, List } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { FileUpload } from '@/components/FileUpload';
import { useFileStore } from '@/stores/file.store.ts';
import { FilePreview } from '@/components/FilePreview';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { TableView as Table } from '@/components/Table.tsx';
import { Grid } from '@/components/Grid.tsx';
import { Button } from '@/components/ui/button.tsx';

export const GalleryPage = () => {
  const { uploadList: files } = useFileStore();
  const memoizedFiles = useMemo(() => files, [files]);
  const [fileSelected, setFileSelected] = useState<File>();
  const [view, setView] = useState('grid');

  useEffect(() => {
    if (fileSelected && ![...files].includes(fileSelected)) {
      setFileSelected(undefined);
    }
  }, [fileSelected, files]);

  const selectFile = useCallback((file?: File) => {
    setFileSelected(file);
  }, []);

  const toggleViews = (view: 'grid' | 'table') => {
    setView(view);
  };

  return (
    <ResizablePanelGroup direction="vertical" className="border">
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full justify-center">
              <ScrollArea className="p-6 w-full h-full">
                <FileUpload />
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full w-full p-6 flex-grow justify-center">
              {fileSelected ? (
                <FilePreview file={fileSelected} rounded={true} />
              ) : (
                <h1 className="flex h-full w-full items-center justify-center">
                  Select a file to preview
                </h1>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40}>
        <div className="p-4 pl-6 pb-0">
          <Button
            variant="outline"
            onClick={() => toggleViews('grid')}
            className={`px-2 ${view !== 'grid' ? 'opacity-50' : ''}`}
          >
            <Grid2X2 />
          </Button>{' '}
          <Button
            variant="outline"
            onClick={() => toggleViews('table')}
            className={`px-2 ${view !== 'table' ? 'opacity-50' : ''}`}
          >
            <List />
          </Button>
        </div>
        <ScrollArea className="flex h-full items-center justify-center p-6 pt-4 pb-20">
          {view === 'grid' && (
            <Grid
              files={memoizedFiles}
              showFileDetails={true}
              selectFile={selectFile}
              selectedFileName={fileSelected?.name}
            />
          )}
          {view === 'table' && (
            <Table
              files={memoizedFiles}
              selectFile={selectFile}
              selectedFileName={fileSelected?.name}
            />
          )}
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
