import { UploadProgressType } from '@/lib/types.ts';
import { toast } from 'sonner';
import { getFileFormat } from '@/lib/utils.ts';
import { ChangeEvent } from 'react';

export default class FileService {
  private eventEmitter: EventTarget;

  constructor() {
    this.eventEmitter = new EventTarget();
  }


  public onProgress = (listener: (progress: UploadProgressType) => void) => {
    this.eventEmitter.addEventListener('progress', (event: Event) => {
      return listener((event as CustomEvent).detail);
    });
  };

  public offProgress = (listener: (progress: UploadProgressType) => void) => {
    this.eventEmitter.removeEventListener('progress', (event: Event) =>
      listener((event as CustomEvent).detail)
    );
  };

  public filterFiles = (
    files: FileList | ChangeEvent<HTMLInputElement>,
    uploadList: FileList | File[],
    alreadyUploaded: FileList | File[]
  ): FileList | File[] => {
    const newFiles = files instanceof FileList ? files : files?.target?.files;
    if (newFiles) {
      return [...newFiles].filter((file) => {
        if (!file.type.match(/image|video|pdf/)) {
          toast('Supported file types are image, video and pdf', {
            description: `${file.name} of type ${getFileFormat(file.type)} is not supported. `
          });
        }
        return (
          ![...uploadList, ...alreadyUploaded].some(
            (f) => f.name === file.name
          ) && file.type.match(/image|video|pdf/)
        );
      });
    }
    return [];
  };

  public startUploading(uploadList: FileList | File[]): Promise<unknown> {
    console.log(uploadList);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(uploadList);
      }, 3000);
    });
  }
}
