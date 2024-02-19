import { useEffect, useState } from 'react';
import { PDFViewer } from '@/components/PDFViewer.tsx';

export const FilePreview = ({ file }: { file: File }) => {
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileType(file.type.split('/')[0]);
      setFileUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (fileType === 'image') {
    return <img src={fileUrl} alt={file.name} />;
  }

  if (fileType === 'video') {
    return (
      <video controls>
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

  if (fileType === 'application') {
    return <PDFViewer fileUrl={fileUrl} />;
  }

  return null;
};
