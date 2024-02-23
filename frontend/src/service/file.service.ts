import axios, { AxiosProgressEvent } from 'axios';
import { CLIENT_UPLOAD_ENDPOINT } from '../../../utils/constants.ts';
import { UploadProgressType } from '@/lib/types.ts';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { getFileFormat } from '../../../utils';

export default class FileService {
  private files?: FileList | File[];
  private fileProgress: UploadProgressType = {};

  private readonly MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB

  constructor(file?: FileList | File[]) {
    this.files = file;
  }

  public setFiles = (files: FileList | File[]) => (this.files = files);

  public setFileProgress = (fileName: string, progress: number) => {
    this.fileProgress = {
      ...this.fileProgress,
      [fileName]: progress,
    };
  };

  public getFileProgress = () => this.fileProgress;

  public removeFile = (removeFile: (file: File) => void) => {
    if (this.files) {
      for (const file of this.files) {
        removeFile(file);
      }
    }
  };

  public uploadFiles = async () => {
    if (this.files) {
      const smallFiles = [...this.files].filter(
        (file) => file.size <= this.MAX_UPLOAD_SIZE,
      );
      const largeFiles = [...this.files].filter(
        (file) => file.size > this.MAX_UPLOAD_SIZE,
      );

      const smallFileUploadPromises = smallFiles.map((file) =>
        this.uploadFile(file),
      );

      const largeFileUploadPromises = largeFiles.map((file) =>
        this.uploadLargeFile(file),
      );

      await Promise.all([smallFileUploadPromises, largeFileUploadPromises]);
    }
  };

  public addFiles = (
    uploadFileList: FileList | File[],
    setUploadFileList: (files: FileList | File[]) => void,
  ) => {
    return (files: FileList | ChangeEvent<HTMLInputElement>) => {
      const newFiles = files instanceof FileList ? files : files?.target?.files;

      if (newFiles) {
        const filteredList = [...newFiles].filter((file) => {
          if (!file.type.match(/image|video|pdf/)) {
            toast('Supported file types are image, video and pdf', {
              description: `${file.name} of type ${getFileFormat(file.type)} is not supported. `,
            });
          }
          return (
            ![...uploadFileList].some((f) => f.name === file.name) &&
            file.type.match(/image|video|pdf/)
          );
        });

        setUploadFileList([...uploadFileList, ...filteredList]);
      }
    };
  };

  private uploadLargeFile = async (file: File) => {
    if (file) {
      const chunkSize = 1024 * 1024 * 100;
      let start = 0;

      while (start < file.size) {
        let end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end); // Create a chunk
        const formData = new FormData();
        formData.append('file', chunk, file.name);
        formData.append('start', start.toString());
        formData.append('end', end.toString());
        formData.append('fileName', file.name);

        try {
          const res = await axios.postForm(
            `${CLIENT_UPLOAD_ENDPOINT}-large`,
            formData,
            this.createConfig(file.name),
          );
          console.log(res.data);
        } catch (err) {
          console.error(err);
        }
        start = end;
      }
    }
  };

  private uploadFile = async (file: File, fileName: string = file.name) => {
    const formData = new FormData();
    formData.append(fileName, file);

    try {
      const res = await axios.postForm(
        CLIENT_UPLOAD_ENDPOINT,
        formData,
        this.createConfig(fileName),
      );
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  private createConfig = (fileName?: string) => ({
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (!progressEvent.total || !fileName) return;
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent?.total,
      );
      this.setFileProgress(fileName, percentCompleted);
    },
  });
}
