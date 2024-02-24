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
  private uploadedBytesPerFile: Map<string, number> = new Map();
  private controller = new AbortController();

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

  public startUploading = async (mock = false) => {
    if (this.files) {
      if (mock) {
        await this.simulateUpload();
        return;
      } else {
        const uploadPromises = [...this.files].map((file) =>
          file.size <= this.MAX_UPLOAD_SIZE
            ? this.uploadFile(file)
            : this.uploadLargeFile(file),
        );

        await Promise.all(uploadPromises);
      }
    }
  };

  public addFiles = (
    fileList: FileList | File[],
    setFileList: (files: FileList | File[]) => void,
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
            ![...fileList].some((f) => f.name === file.name) &&
            file.type.match(/image|video|pdf/)
          );
        });

        setFileList([...fileList, ...filteredList]);
      }
    };
  };

  public offProgress = (listener: (progress: UploadProgressType) => void) => {
    this.eventEmitter.removeEventListener('progress', (event: Event) =>
      listener((event as CustomEvent).detail),
    );
  };

  public pauseUpload = () => {
    this.controller.abort();
  };

  public resumeUpload = async (file: File, retryCount = 0) => {
    this.controller = new AbortController();
    await this.uploadLargeFile(file, retryCount, this.controller);
  };

  private handleProgress = (
    fileName: string,
    totalSize?: number,
  ): AxiosRequestConfig => ({
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (!progressEvent.total) return;

      const uploadedBytes = this.uploadedBytesPerFile.get(fileName) || 0;
      const percentCompleted = totalSize
        ? ((progressEvent.loaded + (uploadedBytes || 0)) * 100) / totalSize
        : (progressEvent.loaded * 100) / progressEvent.total;

      this.setFileProgress(fileName, Math.round(percentCompleted));
    },
  });

  private uploadFile = async (file: File, fileName: string = file.name) => {
    const formData = new FormData();
    formData.append(fileName, file);

    try {
      const ac = new AbortController();
      const res = await axios.head(
        `${CLIENT_UPLOAD_ENDPOINT}/file/${file.name}`,
        {
          signal: ac.signal,
        },
      );
      if (await this.doesFileExist(res.status, file.name, ac)) return;
    } catch (err) {
      console.log('doesnt exist, proceed with upload');
    }

    try {
      const controller = new AbortController();
      const res = await axios.postForm(
        CLIENT_UPLOAD_ENDPOINT,
        formData,
        this.getConfig(file, controller),
      );

      if (await this.doesFileExist(res.data, file.name, controller)) return;
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  private uploadLargeFile = async (
    file: File,
    retryCount = 0,
    controller = new AbortController(),
  ) => {
    const MAX_RETRY_COUNT = 3; // Define your maximum retry count

    if (file) {
      const chunkSize = Math.max(
        this.MAX_UPLOAD_SIZE,
        Math.ceil(file.size / 1000),
      );

      let start = 0;

      try {
        const ac = new AbortController();
        const res = await axios.head(
          `${CLIENT_UPLOAD_ENDPOINT}/file/${file.name}`,
          {
            signal: ac.signal,
          },
        );
        if (await this.doesFileExist(res.status, file.name, ac)) return;
      } catch (err) {
        console.log('doesnt exist, proceed with upload');
      }

      while (start < file.size) {
        const end = Math.min(start + chunkSize, file.size);
        const formData = new FormData();
        formData.append('file', file.slice(start, end), file.name);
        formData.append('start', start.toString());
        formData.append('end', end.toString());
        formData.append('fileName', file.name);

        try {
          const controller = new AbortController();
          const res = await axios.postForm(
            `${CLIENT_UPLOAD_ENDPOINT}-large`,
            formData,
            this.getConfig(file, controller),
          );

          console.log(res.data);
        } catch (err) {
          if (retryCount < MAX_RETRY_COUNT) {
            console.log(`Retry count: ${retryCount + 1}. Retrying...`);
            await this.uploadLargeFile(file, retryCount + 1, controller);
          } else {
            throw err;
          }
        }
        const uploadedBytes = this.uploadedBytesPerFile.get(file.name) || 0;
        this.uploadedBytesPerFile.set(file.name, uploadedBytes + end - start);
        start = end;
      }
    }
  };

  private getConfig = (file: File, controller: AbortController) => ({
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...this.handleProgress(file.name, file.size),
    signal: controller.signal,
  });

  private doesFileExist = async (
    res: string | number,
    fileName: string,
    controller: AbortController,
  ) => {
    if (
      res === 200 ||
      (typeof res === 'string' && res?.includes('already exists'))
    ) {
      toast('File already exists', {
        description: `File ${fileName} already exists.`,
      });
      controller.abort();
      return true;
    }

    return false;
  };

  private simulateUpload = async () => {
    let progress = 0;
    if (!this.files) return;
    while (progress <= 100) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      progress += 10;

      for (const file of this.files) {
        this.setFileProgress(file.name, progress);
      }
    }
  };
}
