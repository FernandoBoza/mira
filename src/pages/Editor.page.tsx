import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { DropZone } from '@/components/upload/DropZone.tsx';
import { useFileStore } from '@/stores/file.store.ts';
import { FilePreview } from '@/components/FilePreview';
import { Gallery } from '@/components/Gallery.tsx';
import { useState } from 'react';

export const EditorPage = () => {

  const files = useFileStore().uploadList;
  const [fileSelected, setFileSelected] = useState<File>()
  
  const selectFile = (file: File) => {
    setFileSelected(file)
  }
  
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
            <div className="flex h-full w-full p-6 flex-grow">
              {fileSelected
                ? <FilePreview file={fileSelected} />
                : <div className="flex h-full items-center justify-center">Select a file to preview</div>
              }
            </div>
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