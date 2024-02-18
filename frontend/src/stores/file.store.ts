import { create } from 'zustand';

type FileStoreType = {
  fileList: FileList | [];
  setFileList: (files: FileList) => void;
  hasSubmitted: boolean;
  setHasSubmit: (hasSubmitted: boolean) => void;
};

export const useFileStore = create<FileStoreType>((set) => ({
  fileList: [],
  setFileList: (files: FileList) => {
    set({ fileList: files });
  },
  hasSubmitted: false,
  setHasSubmit: (hasSubmitted: boolean) => {
    set({ hasSubmitted });
  },
}));
