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

  uploadFiles = async () => {
    if (this.files) {
      // const fileUploadPromises = [...this.files].map(async (file) => {
      //   const formData = new FormData();
      //
      //   if (file.size > this.MAX_UPLOAD_SIZE) {
      //     const chunkArray = this.splitLargeFileForUpload(file);
      //     console.log('File is too large to upload in one go', chunkArray);
      //     chunkArray.forEach((chunk, index) => {
      //       formData.append(`${file.name}_${index}`, chunk);
      //     });
      //   }
      //
      //   formData.append(file.name, file);
      //
      //   try {
      //     const res = await axios.post(CLIENT_UPLOAD_ENDPOINT, formData, {
      //       onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      //         if (!progressEvent.total) return;
      //         const percentCompleted = Math.round(
      //           (progressEvent.loaded * 100) / progressEvent?.total,
      //         );
      //         this.setFileProgress(file.name, percentCompleted);
      //       },
      //     });
      //     console.log(res.data);
      //   } catch (err) {
      //     return console.error(err);
      //   }
      // });
      //
      // await Promise.all(fileUploadPromises);

      const smallFiles = [...this.files].filter(
        (file) => file.size <= this.MAX_UPLOAD_SIZE,
      );
      const largeFiles = [...this.files].filter(
        (file) => file.size > this.MAX_UPLOAD_SIZE,
      );

      const smallFileUploadPromises = smallFiles.map((file) =>
        this.uploadFile(file),
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
  };

  uploadFile = async (file: File, fileName: string = file.name) => {
    const formData = new FormData();
    formData.append(fileName, file);

    try {
      const res = await axios.post(CLIENT_UPLOAD_ENDPOINT, formData, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (!progressEvent.total) return;
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent?.total,
          );
          this.setFileProgress(fileName, percentCompleted);
        },
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  splitLargeFileForUpload = (file: File) => {
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
}
