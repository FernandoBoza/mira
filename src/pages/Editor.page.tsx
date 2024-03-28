import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable.tsx';
import { DropZone } from '@/components/upload/DropZone.tsx';
import { useFileStore } from '@/stores/file.store.ts';
import { FilePreview } from '@/components/FilePreview';
import { Gallery } from '@/components/layout/Gallery.tsx';
import { useEffect, useState } from 'react';

export const EditorPage = () => {
  const files = useFileStore().uploadList;
  const [fileSelected, setFileSelected] = useState<File>();
  const { uploadList } = useFileStore();

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
    <h1 className="flex h-full w-full text-2xl font-semibold items-center justify-center">
      Select a file to preview
    </h1>
  );

  return (
    <ResizablePanelGroup direction="vertical" className="border">
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full justify-center">
              <DropZone />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full w-full p-6 flex-grow">{RenderSection}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <Gallery files={files} selectFile={selectFile} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
