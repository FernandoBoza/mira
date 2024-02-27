import { create } from 'zustand';

type FileStoreType = {
  uploadList: FileList | File[];
  hasSubmitted: boolean;
  setUploadList: (files: FileList | File[]) => void;
  removeFile: (file: File) => void;
  setHasSubmit: (hasSubmitted: boolean) => void;
};

export const useFileStore = create<FileStoreType>((set) => ({
  uploadList: [],
  hasSubmitted: false,
  setUploadList: (files: FileList | File[]) => {
    set((state) => ({ uploadList: [...state.uploadList, ...files] }));
  },
  setHasSubmit: (hasSubmitted: boolean) => {
    set({ hasSubmitted });
  },
  removeFile: (file: File) => {
    set((state) => ({
      uploadList: [...state.uploadList].filter((f) => f.name !== file.name),
    }));
  },
}));
