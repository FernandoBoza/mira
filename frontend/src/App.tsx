import { DropZone } from './components/upload';
import { ModeToggle } from '@/components/layout/mode-toggle.tsx';
import { Gallery } from '@/components/Gallery.tsx';
import { useFileStore } from '@/stores/file.store.ts';

function App() {
  const fileList = useFileStore((state) => state.fileList);

  return (
    <div className="p-8">
      <ModeToggle />
      <DropZone />
      <Gallery files={fileList} />
    </div>
  );
}

export default App;
