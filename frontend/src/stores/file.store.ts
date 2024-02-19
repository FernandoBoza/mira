import { create } from 'zustand';

type FileStoreType = {
  fileList: FileList | File[];
  hasSubmitted: boolean;
  setFileList: (files: FileList) => void;
  removeFile: (file: File) => void;
  setHasSubmit: (hasSubmitted: boolean) => void;
};

export const useFileStore = create<FileStoreType>((set) => ({
  fileList: [],
  hasSubmitted: false,
  setFileList: (files: FileList) => {
    set({ fileList: files });
  },
  removeFile: (file: File) => {
    const fileList = useFileStore.getState().fileList;
    set({
      fileList: [...fileList].filter((f) => f.name !== file.name),
    });
  },
  setHasSubmit: (hasSubmitted: boolean) => {
    set({ hasSubmitted });
  },
}));
