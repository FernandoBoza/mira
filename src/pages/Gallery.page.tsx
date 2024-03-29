import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable.tsx';
import { FileUpload } from '@/components/FileUpload';
import { useFileStore } from '@/stores/file.store.ts';
import { FilePreview } from '@/components/FilePreview';
import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { TableView } from '@/components/Table.tsx';
import { Gallery } from '@/components/Gallery.tsx';
import { Grid2X2, List } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';

export const GalleryPage = () => {
  const files = useFileStore().uploadList;
  const [fileSelected, setFileSelected] = useState<File>();
  const { uploadList } = useFileStore();
  const [view, setView] = useState('grid');

  const selectFile = (file: File) => {
    setFileSelected(file);
  };

  useEffect(() => {
    if (fileSelected && ![...uploadList].includes(fileSelected)) {
      setFileSelected(undefined);
    }
  }, [fileSelected, uploadList]);

  const RenderSection = fileSelected ? (
    <FilePreview file={fileSelected} />
  ) : (
    <h1 className="flex h-full w-full items-center justify-center">Select a file to preview</h1>
  );

  const toggleViews = (view: 'grid' | 'table') => {
    setView(view);
  };

  const MemoGrid = React.memo(Gallery);
  const MemoTableView = React.memo(TableView);

  return (
    <ResizablePanelGroup direction="vertical" className="border">
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full justify-center">
              <FileUpload />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full w-full p-6 flex-grow">{RenderSection}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40}>
        <div className="p-6 pb-0">
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
        <ScrollArea className="flex h-full items-center justify-center p-6">
          {view === 'grid' && <MemoGrid files={files} selectFile={selectFile} />}
          {view === 'table' && <MemoTableView files={files} selectFile={selectFile} />}
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
