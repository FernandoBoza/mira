import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { DropZone } from '@/components/upload/DropZone.tsx';
import { useFileStore } from '@/stores/file.store.ts';
import { FilePreview } from '@/components/FilePreview';

export const EditorPage = () => {

  const files = useFileStore().uploadList;
  return (
    (
      <ResizablePanelGroup direction="vertical" className="border">
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full justify-center">
                <DropZone />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6">
                {[...files].map((file) => (
                  <FilePreview key={file.name} file={file} />
                ))}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Three</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  );
};