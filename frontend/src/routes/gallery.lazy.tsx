import { createLazyFileRoute } from '@tanstack/react-router';
import Page from '@/pages';
import FileService from '@/service/file.service.ts';
import { useEffect, useState } from 'react';
import { Gallery } from '@/components/Gallery.tsx';

const fs = new FileService();

export const Route = createLazyFileRoute('/gallery')({
  component: () => {
    const [files, setFiles] = useState();
    useEffect(() => {
      fs.getAllFiles().then(setFiles);
    }, []);

    console.log(files);

    return (
      <Page>
        <h1>Gallery</h1>
        {files && <Gallery files={[files]} />}{' '}
      </Page>
    );
  },
});
