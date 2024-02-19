import { useEffect, useState } from 'react';
import { PDFViewer } from '@/components/FilePreview/PDFViewer.tsx';

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

    return () => {};
  }, [file]);

  if (fileType === 'image') {
    return <img className="h-28 w-auto" src={fileUrl} alt={file.name} />;
  }

  if (fileType === 'video') {
    if (file.size > 314572800) {
      return <p>Can't preview video, file is over 300MB</p>;
    }
    return (
      <video className="h-48 w-auto" controls>
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
