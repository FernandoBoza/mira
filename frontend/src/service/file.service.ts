import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { CLIENT_UPLOAD_ENDPOINT } from '../../../utils/constants.ts';
import { UploadProgressType } from '@/lib/types.ts';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { getFileFormat } from '../../../utils';

export default class FileService {
  private eventEmitter: EventTarget;
  private files?: FileList | File[];
  private fileProgress: UploadProgressType = {};
  private readonly MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB
  private uploadedBytes = 0;

  constructor(file?: FileList | File[]) {
    this.files = file;
    this.eventEmitter = new EventTarget();
  }

  public setFiles = (files: FileList | File[]) => (this.files = files);

  public setFileProgress = (fileName: string, progress: number) => {
    this.fileProgress = {
      ...this.fileProgress,
      [fileName]: progress,
    };
    const event = new CustomEvent('progress', { detail: this.fileProgress });
    this.eventEmitter.dispatchEvent(event);
  };

  public onProgress = (listener: (progress: UploadProgressType) => void) => {
    this.eventEmitter.addEventListener('progress', (event: Event) => {
      return listener((event as CustomEvent).detail);
    });
  };

  public removeFile = (removeFile: (file: File) => void) => {
    if (this.files) {
      for (const file of this.files) {
        removeFile(file);
      }
    }
  };

  public startUploading = async () => {
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

  public simulateUpload = async () => {
    let progress = 0;
    if (!this.files) return;
    while (progress <= 100) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      progress += 10;

      for (const file of this.files) {
        this.setFileProgress(file.name, progress);
      }
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

  public offProgress = (listener: (progress: UploadProgressType) => void) => {
    this.eventEmitter.removeEventListener('progress', (event: Event) =>
      listener((event as CustomEvent).detail),
    );
  };

  private handleProgress = (
    fileName: string,
    uploadedBytes?: number,
    totalSize?: number,
  ): AxiosRequestConfig => ({
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      let percentCompleted = 0;
      if (!progressEvent.total) return;

      if (!totalSize) {
        percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
      } else {
        percentCompleted = Math.round(
          ((progressEvent.loaded + (uploadedBytes || 0)) * 100) / totalSize,
        );
      }
      this.setFileProgress(fileName, percentCompleted);
    },
  });

  private uploadLargeFile = async (file: File) => {
    if (file) {
      const chunkSize = 1024 * 1024 * 100;
      let start = 0;

      while (start < file.size) {
        const end = Math.min(start + chunkSize, file.size);
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
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              ...this.handleProgress(file.name, this.uploadedBytes, file.size),
            },
          );
          console.log(res.data);
        } catch (err) {
          console.error(err);
        }
        this.uploadedBytes += end - start;
        start = end;
      }
    }
  };

  private uploadFile = async (file: File, fileName: string = file.name) => {
    const formData = new FormData();
    formData.append(fileName, file);

    try {
      const res = await axios.postForm(CLIENT_UPLOAD_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...this.handleProgress(fileName),
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };
}
