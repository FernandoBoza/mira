import { DragEvent, useCallback, useRef, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';
// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import { fetchFile } from '@ffmpeg/util';

type TimelineProps = {
  duration: number;
  onScrub: (time: number) => void;
};

// const ffmpeg = new FFmpeg();

export const Timeline = ({ duration, onScrub }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { draggedFile, setDraggedFile } = useFileStore();
  const [frames, setFrames] = useState<string[]>([]);

  //const ffmpeg = new FFmpeg();
  // await ffmpeg.load();
  // await ffmpeg.writeFile("video.avi", ...);
  // // ffmpeg -i video.avi video.mp4
  // await ffmpeg.exec([
  // "-i",
  // "video.avi",
  // "video.mp4"
  // ]);
  // const data = ffmpeg.readFile("video.mp4");

  // const commands = ['-i', 'output.webm', '-vf', 'fps=1', 'scale=-1:480', 'output_%d.jpg'];
  //
  // useEffect(() => {
  //   const doTranscode = async () => {
  //     await ffmpeg.load();
  //     const file = await fetchFile(draggedFile);
  //     await ffmpeg.writeFile('test.mp4', file);
  //     await ffmpeg.exec(commands, -1);
  //     const data = await ffmpeg.listDir('/');
  //     const jpgFiles = data.filter((file) => file.name.endsWith('.jpg'));
  //     const frames = jpgFiles.map((file) => {
  //       const data = ffmpeg.readFile('file');
  //       const base64 = Buffer.from(data).toString('base64');
  //       return `data:image/jpg;base64,${base64}`;
  //     });
  //     setFrames(frames);
  //   };
  //   doTranscode().then((r) => console.log(r));
  // }, [draggedFile, setFrames]);

  const generateFrames = useCallback(
    (track: File) => {
      console.log(track);

      setDraggedFile(undefined);
    },
    [setDraggedFile],
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
      {frames &&
        frames.length > 0 &&
        frames.map((frame, index) => <img key={index} src={frame} alt="scrub" />)}
    </div>
  );
};
