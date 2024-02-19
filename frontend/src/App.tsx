import { DropZone } from './components/upload';
import { FilePreview } from '@/components/FilePreview.tsx';
import { ModeToggle } from '@/components/layout/mode-toggle.tsx';
import { useFileStore } from '@/stores/file.store.ts';

function App() {
  const { fileList } = useFileStore();

  return (
    <div className="p-8">
      <ModeToggle />
      <DropZone />
      {fileList.length >= 1 && (
        <section className="flex flex-wrap gap-4 p-8">
          {[...fileList].map((file) => (
            <FilePreview key={file.name} file={file} />
          ))}
        </section>
      )}
    </div>
  );
}

export default App;
