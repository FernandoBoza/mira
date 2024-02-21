import { create } from 'zustand';

type FileStoreType = {
  uploadFileList: FileList | File[];
  hasSubmitted: boolean;
  setUploadFileList: (files: FileList | File[]) => void;
  removeFile: (file: File) => void;
  setHasSubmit: (hasSubmitted: boolean) => void;
};

export const useFileStore = create<FileStoreType>((set) => ({
  uploadFileList: [],
  hasSubmitted: false,
  setUploadFileList: (files: FileList | File[]) => {
    set({ uploadFileList: files });
  },
  removeFile: (file: File) => {
    const fileList = useFileStore.getState().uploadFileList;
    set({
      uploadFileList: [...fileList].filter((f) => f.name !== file.name),
    });
  },
  setHasSubmit: (hasSubmitted: boolean) => {
    set({ hasSubmitted });
  },
}));
