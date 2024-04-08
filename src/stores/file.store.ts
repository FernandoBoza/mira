import { create } from 'zustand';

type FileStoreType = {
  uploadList: FileList | File[];
  alreadyUploaded: FileList | File[];
  hasSubmitted: boolean;
  setUploadList: (files: FileList | File[]) => void;
  setAlreadyUploadList: (file: File) => void;
  removeFile: (file: File) => void;
  setHasSubmit: (hasSubmitted: boolean) => void;
  draggedFile?: File;
  setDraggedFile: (file?: File) => void;
  timeStamp: string;
  setTimeStamp?: (time: string) => void;
};

export const useFileStore = create<FileStoreType>((set) => ({
  uploadList: [],
  alreadyUploaded: [],
  hasSubmitted: false,
  draggedFile: undefined,
  timeStamp: '00:00',
  setTimeStamp: (time: string) => {
    set({ timeStamp: time });
  },
  setDraggedFile: (file?: File) => {
    set({ draggedFile: file });
  },
  setUploadList: (files: FileList | File[]) => {
    set((state) => ({ uploadList: [...state.uploadList, ...files] }));
  },
  setAlreadyUploadList: (file: File) => {
    set((state) => ({ alreadyUploaded: [...state.alreadyUploaded, file] }));
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
