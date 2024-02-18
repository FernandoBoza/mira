import { create } from 'zustand';

type FileStoreType = {
  fileList: FileList | [];
  setFileList: (files: FileList) => void;
  hasSubmitted: boolean;
  setSubmit: (hasSubmitted: boolean) => void;
};

export const useFileStore = create<FileStoreType>((set) => ({
  fileList: [],
  setFileList: (files: FileList) => {
    set({ fileList: files });
  },
  hasSubmitted: false,
  setSubmit: (hasSubmitted: boolean) => {
    set({ hasSubmitted });
  },
}));
