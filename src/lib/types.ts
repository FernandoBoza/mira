export type UploadProgressType = {
  [fileName: string]: number;
};

export type AddFilesType = {
  uploadList: FileList | File[];
  setUploadList: (files: FileList | File[]) => void;
};
