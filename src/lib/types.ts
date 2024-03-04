import { ChangeEvent } from 'react';

export type FileFilterType = {
  files: FileList | ChangeEvent<HTMLInputElement>;
  uploadList: FileList | File[];
  alreadyUploaded: FileList | File[]
}