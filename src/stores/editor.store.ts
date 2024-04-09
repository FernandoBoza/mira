import { create } from 'zustand';

type EditorStoreType = {
  draggedFile?: File;
  setDraggedFile: (file?: File) => void;
  timeStamp: string;
  setTimeStamp?: (time: string) => void;
};

export const useEditorStore = create<EditorStoreType>((set) => ({
  draggedFile: undefined,
  timeStamp: '00:00',
  setTimeStamp: (time: string) => {
    set({ timeStamp: time });
  },
  setDraggedFile: (file?: File) => {
    set({ draggedFile: file });
  },
}));
