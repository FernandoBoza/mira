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
    set({ uploadList: files });
  },
  removeFile: (file: File) => {
    const fileList = useFileStore.getState().uploadList;
    set({
      uploadList: [...fileList].filter((f) => f.name !== file.name),
    });
  },
  setHasSubmit: (hasSubmitted: boolean) => {
    set({ hasSubmitted });
  },
}));
