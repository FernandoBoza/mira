import { DragEvent, useCallback, useRef, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';

type TimelineProps = {
  duration: number;
  onScrub: (time: number) => void;
  selectFile?: (file?: File) => void;
};

export const Timeline = ({ duration, onScrub, selectFile }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { draggedFile, setDraggedFile } = useFileStore();
  const [frames, setFrames] = useState<string[]>([]);

  const generateFrames = useCallback(
    (track: File) => {
      console.log(track);
      selectFile && selectFile(track);

      setFrames([]); // clear frames
      setDraggedFile(undefined);
    },
    [selectFile, setDraggedFile],
  );

  const handleScrub = (event: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const scrubTime = (x / rect.width) * duration;
      onScrub(scrubTime);
    }
  };

  const preventDefaults = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      preventDefaults(e);
      if (draggedFile) generateFrames(draggedFile);
    },
    [generateFrames, draggedFile, preventDefaults],
  );

  return (
    <div
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDrop={handleDrop}
      ref={timelineRef}
      onClick={handleScrub}
      className="h-full"
    >
      TimeLine
      {!!frames.length && frames.map((frame, index) => <img key={index} src={frame} alt="scrub" />)}
    </div>
  );
};
