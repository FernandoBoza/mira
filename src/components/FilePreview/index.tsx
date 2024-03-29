import { useEffect, useState } from 'react';
import { PDFViewer } from '@/components/FilePreview/PDFViewer.tsx';
import { getFileType } from '@/lib/utils.ts';
import { VideoPlayer } from '@/components/FilePreview/VideoPlayer.tsx';

type FilePreviewProps = {
  file: File;
  disablePlayBack?: boolean;
};

export const FilePreview = ({ file, disablePlayBack }: FilePreviewProps) => {
  if (!(file instanceof File)) {
    throw new Error('Invalid prop: file must be an instance of File');
  }

  // typeof file.size === 'number' is a workaround for a TypeScript/JavaScript runtime validation bug
  if (!file.name || !file.type || typeof file.size !== 'number') {
    throw new Error('Invalid prop: file must have name, type, and size properties');
  }

  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileType(getFileType(file.type));
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    return () => {
      setFileUrl('');
      setFileType('');
    };
  }, [file]);

  switch (fileType) {
    case 'image':
      return (
        <img
          loading="lazy"
          className="h-auto w-auto mx-auto contain aspect-auto"
          src={fileUrl}
          alt={file.name}
        />
      );
    case 'video':
      if (file.size > 314572800) {
        return (
          <div className="flex h-full text-center items-center">
            <p className="my-0 mx-auto">Can't preview video, file is over 300MB</p>
          </div>
        );
      }
      return <VideoPlayer disablePlayBack={disablePlayBack} src={fileUrl} />;
    case 'audio':
      return (
        <audio controls>
          <source src={fileUrl} type={file.type} />
        </audio>
      );
    case 'application':
      return <PDFViewer fileUrl={fileUrl} />;
    default:
      return null;
  }
};

// TODO: Styles for gallery icons and smaller images
//.h-auto.w-auto.contain.aspect-auto {
//     max-height: 100%;
//     margin: auto;
//     align-items: center;
//
// }
// .p-6.pt-0.h-full.max-h-48.xl\:h-60.overflow-hidden.px-0 {
//     display: flex;
//
// }