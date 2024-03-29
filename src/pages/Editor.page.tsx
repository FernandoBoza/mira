import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';

const EditorPage = () => {
  return (
    <ResizablePanelGroup direction="vertical" className="border">
      <ResizablePanel defaultSize={70}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20}>
            <div className="flex h-full justify-center">
              {/*FilesSelected*/}
              <p>FilesSelected</p>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <p>Preview</p>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30}>
        <p>Timeline</p>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default EditorPage;
