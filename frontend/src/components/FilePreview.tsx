import { useEffect, useState } from 'react';
import { PdfViewer } from '@/components/PDFViewer.tsx';

export const FilePreview = ({ file }: { file: File }) => {
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      const fileType = file.type.split('/')[0];
      setFileType(fileType);
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

  if (fileType === 'application' && file.type === 'application/pdf') {
    return <PdfViewer fileUrl={fileUrl} />;
  }

  return null;
};
