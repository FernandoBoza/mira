import { DropZone } from './components/upload/DropZone.tsx';
import { ModeToggle } from '@/components/layout/mode-toggle.tsx';
import { Gallery } from '@/components/Gallery.tsx';
import { useFileStore } from '@/stores/file.store.ts';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const fileList = useFileStore((state) => state.fileList);

  return (
    <>
      <Toaster />
      <div className="p-8 flex flex-col gap-8">
        <ModeToggle />
        <DropZone />
        <Gallery files={fileList} />
      </div>
    </>
  );
}

export default App;
