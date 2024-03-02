import { createLazyFileRoute } from '@tanstack/react-router';
import Page from '@/pages';
import { Gallery } from '@/components/Gallery.tsx';

// const fs = new FileService();

// const file = fs.getFiles();

export const Route = createLazyFileRoute('/gallery')({
  component: () => (
    <Page>
      <h1>Gallery</h1>
      <Gallery files={[]} />
    </Page>
  ),
});
