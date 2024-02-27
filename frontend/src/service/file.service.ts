import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { CLIENT_UPLOAD_ENDPOINT } from '../../../utils/constants.ts';
import { UploadProgressType } from '@/lib/types.ts';
import { toast } from 'sonner';
import { getFileFormat } from '../../../utils';
import { useFileStore } from '@/stores/file.store.ts';

const setFileStore = useFileStore.getState();

export default class FileService {
  private eventEmitter: EventTarget;
  private fileProgress: UploadProgressType = {};
  private readonly MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB
  private uploadedBytesPerFile: Map<string, number> = new Map();
  private controller = new AbortController();

  constructor() {
    this.eventEmitter = new EventTarget();
  }

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

  public startUploading = async (files: FileList | File[], mock = false) => {
    if (files) {
      if (mock) {
        await this.simulateUpload(files);
        return;
      } else {
        for (const file of [...files]) {
          if (this.uploadedBytesPerFile.has(file.name)) continue;
          if (file.size <= this.MAX_UPLOAD_SIZE) {
            await this.uploadFile(file);
          } else {
            await this.uploadLargeFile(file);
          }
        }
      }
    }
  };

  public addFiles = (files: FileList | null) => {
    if (files) {
      setFileStore.setUploadList(
        [...files].filter((file) => {
          if (!file.type.match(/image|video|pdf/)) {
            toast('Supported file types are image, video and pdf', {
              description: `${file.name} of type ${getFileFormat(file.type)} is not supported. `,
            });
          }
          return (
            ![
              ...useFileStore.getState().uploadList,
              ...useFileStore.getState().alreadyUploaded,
            ].some((f) => f.name === file.name) &&
            file.type.match(/image|video|pdf/)
          );
        }),
      );
    }
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

    if (await this.doesFileExist(file.name)) return;

    try {
      const controller = new AbortController();
      const res = await axios.postForm(
        CLIENT_UPLOAD_ENDPOINT,
        formData,
        this.getConfig(file, controller),
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (
        ![...useFileStore.getState().alreadyUploaded].some(
          (f) => f.name === file.name,
        )
      ) {
        setFileStore.setAlreadyUploadList(file);
      }
      setFileStore.removeFile(file);
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

      if (await this.doesFileExist(file.name)) return;

      while (start < file.size) {
        const end = Math.min(start + chunkSize, file.size);
        const formData = new FormData();
        formData.append('file', file.slice(start, end), file.name);
        formData.append('start', start.toString());
        formData.append('end', end.toString());
        formData.append('fileName', file.name);
        formData.append(
          'fileIsLastChunk',
          end === file.size ? 'true' : 'false',
        );

        try {
          const controller = new AbortController();
          const res = await axios.postForm(
            `${CLIENT_UPLOAD_ENDPOINT}-large`,
            formData,
            this.getConfig(file, controller),
          );

          if (res.data === 'Uploaded large files') {
            if (
              ![...useFileStore.getState().alreadyUploaded].some(
                (f) => f.name === file.name,
              )
            ) {
              setFileStore.setAlreadyUploadList(file);
            }
            setFileStore.removeFile(file);
            console.log(res.data);
            break;
          }
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

  private doesFileExist = async (fileName: string) => {
    try {
      const controller = new AbortController();
      const res = await axios.head(
        `${CLIENT_UPLOAD_ENDPOINT}/file/${fileName}`,
        {
          signal: controller.signal,
        },
      );
      if (res.status === 200 || res.statusText === 'OK') {
        toast('File already exists', {
          description: `File ${fileName} already exists.`,
        });
        controller.abort();
        return true;
      }
    } catch (err) {
      console.log('doesnt exist, proceed with upload');
      return false;
    }
  };

  private simulateUpload = async (files: FileList | File[]) => {
    let progress = 0;
    if (!files) return;
    while (progress <= 100) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      progress += 10;
      for (const file of files) {
        this.setFileProgress(file.name, progress);
      }
    }
  };
}
