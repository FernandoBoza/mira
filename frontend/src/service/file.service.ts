import axios, { AxiosProgressEvent } from 'axios';
import { CLIENT_UPLOAD_ENDPOINT } from '../../../utils/constants.ts';
import { UploadProgressType } from '@/lib/types.ts';

export default class FileService {
  private files?: FileList | File[];
  private fileProgress: UploadProgressType = {};

  private readonly MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB

  constructor(file?: FileList | File[]) {
    this.files = file;
  }

  public setFiles = (files: FileList | File[]) => {
    this.files = files;
  };

  public setFileProgress = (fileName: string, progress: number) => {
    this.fileProgress = {
      ...this.fileProgress,
      [fileName]: progress,
    };
  };

  public getFileProgress = () => {
    return this.fileProgress;
  };

  public removeFile = (removeFile: (file: File) => void) => {
    if (this.files) {
      for (const file of this.files) {
        removeFile(file);
      }
    }
  };

  public uploadFiles = async (test?: boolean) => {
    if (test) {
      await this.testUploadFiles();
    } else {
      if (this.files) {
        const smallFiles = [...this.files].filter(
          (file) => file.size <= this.MAX_UPLOAD_SIZE,
        );
        const largeFiles = [...this.files].filter(
          (file) => file.size > this.MAX_UPLOAD_SIZE,
        );

        const smallFileUploadPromises = smallFiles.map((file) =>
          this.uploadFile(file).then(() =>
            this.removeFile((file) => console.log(`File ${file.name} removed`)),
          ),
        );
        await Promise.all(smallFileUploadPromises);

        for (const file of largeFiles) {
          const chunkArray = this.splitLargeFileForUpload(file);
          await chunkArray.reduce(async (promiseChain, chunk, index) => {
            await promiseChain;
            return await this.uploadFile(chunk, `${file.name}_${index}`);
          }, Promise.resolve());
        }
      }
    }
  };

  testUploadFiles = async () => {
    if (this.files) {
      const chunkSize = 1024 * 1024 * 100;
      let start = 0;

      while (start < this.files[0].size) {
        let end = Math.min(start + chunkSize, this.files[0].size);
        const chunk = this.files[0].slice(start, end); // Create a chunk
        const formData = new FormData();
        formData.append('file', chunk, this.files[0].name);
        formData.append('start', start.toString());
        formData.append('end', end.toString());
        formData.append('fileName', this.files[0].name);

        try {
          const res = await axios.postForm(
            `${CLIENT_UPLOAD_ENDPOINT}-large`,
            formData,
            this.createConfig(),
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

  private splitLargeFileForUpload = (file: File) => {
    const BYTES_PER_CHUNK = this.MAX_UPLOAD_SIZE; //100MB chunk sizes.
    const SIZE = file.size;
    const NUM_CHUNKS = Math.max(SIZE / BYTES_PER_CHUNK, 1);
    const chunkArray: File[] = [];
    let start = 0;
    let end = 0;

    for (let index = 0; index < NUM_CHUNKS; index++) {
      end = Math.min(SIZE, start + BYTES_PER_CHUNK);
      const chunk = new File(
        [file.slice(start, end)],
        `${file.name}_${index}`,
        {
          type: file.type,
          lastModified: file.lastModified,
        },
      );
      chunkArray.push(chunk);
      start = end;
    }

    return chunkArray;
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
