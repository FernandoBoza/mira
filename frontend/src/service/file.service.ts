import axios, { AxiosProgressEvent } from 'axios';
import { CLIENT_UPLOAD_ENDPOINT } from '../../../utils/constants.ts';
import { UploadProgressType } from '@/lib/types.ts';

export default class FileService {
  private files?: FileList | File[];
  private fileProgress: UploadProgressType = {};

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
      const fileUploadPromises = [...this.files].map(async (file) => {
        const formData = new FormData();
        formData.append(file.name, file);

        try {
          const res = await axios.post(CLIENT_UPLOAD_ENDPOINT, formData, {
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
              if (!progressEvent.total) return;
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent?.total,
              );
              this.setFileProgress(file.name, percentCompleted);
            },
          });
          console.log(res.data);
        } catch (err) {
          return console.error(err);
        }
      });

      await Promise.all(fileUploadPromises);
    }
  };
}
