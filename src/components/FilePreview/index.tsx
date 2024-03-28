import { useEffect, useState } from 'react';
import { PDFViewer } from '@/components/FilePreview/PDFViewer.tsx';
import { getFileType } from '@/lib/utils.ts';
import { VideoPlayer } from '@/components/FilePreview/VideoPlayer.tsx';

export const FilePreview = ({ file, disablePlayBack }: { file: File, disablePlayBack?: boolean }) => {

  if (!(file instanceof File)) {
    throw new Error('Invalid prop: file must be an instance of File');
  }

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
      return <img className="h-auto w-auto contain aspect-auto" src={fileUrl} alt={file.name} />;
    case 'video':
      if (file.size > 314572800) {
        return (
          <div className="flex h-full text-center items-center">
            <p className="my-0 mx-auto">
              Can't preview video, file is over 300MB
            </p>
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
