import { createLazyFileRoute } from '@tanstack/react-router';
import { DropZone } from '../components/upload/DropZone.tsx';
import { Gallery } from '@/components/Gallery.tsx';
import { useFileStore } from '@/stores/file.store.ts';

export const Route = createLazyFileRoute('/upload')({
  errorComponent: () => <div>Error</div>,
  component: () => <Upload />,
});

function Upload() {
  const uploadFileList = useFileStore((state) => state.uploadList);

  return (
    <div className="p-8 flex flex-col gap-8">
      <DropZone />
      <Gallery files={uploadFileList} />
    </div>
  );
}
