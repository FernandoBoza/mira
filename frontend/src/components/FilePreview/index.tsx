import { useEffect, useState } from 'react';
import { PDFViewer } from '@/components/FilePreview/PDFViewer.tsx';
import { getFileType } from '../../../../utils';

export const FilePreview = ({ file }: { file: File }) => {
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

  if (fileType === 'image') {
    return (
      <img className="h-auto w-auto contain" src={fileUrl} alt={file.name} />
    );
  }

  if (fileType === 'video') {
    if (file.size > 314572800) {
      return (
        <div className="flex h-full text-center items-center">
          <p className="my-0 mx-auto">
            Can't preview video, file is over 300MB
          </p>
        </div>
      );
    }
    return (
      <video className="h-auto w-auto" controls>
        <source src={fileUrl} type={file.type} />
      </video>
    );
  }

  if (fileType === 'audio') {
    return (
      <audio controls>
        <source src={fileUrl} type={file.type} />
      </audio>
    );
  }

  if (fileType === 'application') return <PDFViewer fileUrl={fileUrl} />;

  return null;
};
