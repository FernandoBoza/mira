import { DropZone } from './components/upload';
import { FilePreview } from '@/components/FilePreview.tsx';
import { useFileStore } from '@/stores/file.store.ts';

function App() {
  const { fileList } = useFileStore();

  return (
    <>
      <main className="p-8">
        <DropZone />
      </main>
      {fileList.length >= 1 && (
        <section className="flex flex-wrap gap-4 p-8">
          {[...fileList].map((file) => (
            <FilePreview key={file.name} file={file} />
          ))}
        </section>
      )}
    </>
  );
}

export default App;
