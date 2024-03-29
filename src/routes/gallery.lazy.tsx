import { createLazyFileRoute } from '@tanstack/react-router';
import Page from '@/pages';
import { GalleryPage } from '@/pages/Gallery.page.tsx';

export const Route = createLazyFileRoute('/gallery')({
  component: () => (
    <Page className="p-0 h-[92.5vh] h-xl:h-[94.5vh]">
      <GalleryPage />
    </Page>
  ),
});
