import { DropZone } from './components/upload/DropZone.tsx';
import { ModeToggle } from '@/components/layout/mode-toggle.tsx';
import { Gallery } from '@/components/Gallery.tsx';
import { useFileStore } from '@/stores/file.store.ts';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';

function App() {
  const uploadFileList = useFileStore((state) => state.uploadList);
  const worker = new Worker(new URL('./web.worker.ts', import.meta.url), {
    type: 'module',
  });

  useEffect(() => {
    worker.onmessage = (event) => {
      console.log('Worker said:', event.data);
    };

    worker.postMessage('Hello World');
  }, [worker.onmessage]);

  return (
    <>
      <Toaster />
      <div className="p-8 flex flex-col gap-8">
        <ModeToggle />
        <DropZone />
        <Gallery files={uploadFileList} />
      </div>
    </>
  );
}

export default App;
