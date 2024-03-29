import { DragEvent, useCallback, useEffect, useRef } from 'react';
import { useFileStore } from '@/stores/file.store.ts';

type TimelineProps = {
  duration: number;
  onScrub: (time: number) => void;
};

export const Timeline = ({ duration, onScrub }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { draggedFile, setDraggedFile } = useFileStore();

  useEffect(() => {
    // TODO: Extract frames from the video and display them in the timeline
  }, [duration]);

  const addTrack = (track: File) => {
    console.log(track);
    setDraggedFile(undefined);
  };

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
      if (draggedFile) addTrack(draggedFile);
    },
    [draggedFile, preventDefaults],
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
    </div>
  );
};
