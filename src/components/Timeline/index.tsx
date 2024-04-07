import { ChangeEvent, DragEvent, useCallback, useRef, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';

type TimelineProps = {
  selectFile?: (file?: File) => void;
};

export const Timeline = ({ selectFile }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { draggedFile, setDraggedFile } = useFileStore();
  const [frames, setFrames] = useState<string[]>([]);
  const [displayedFrames, setDisplayedFrames] = useState<string[]>([]);

  const handleSliderChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const totalFrames = frames.length; // replace with your total frames
      const steps = Number(e.target.value); // number of steps

      const framesAtIntervals = Array.from({ length: steps }, (_, i) =>
        Math.floor(i * totalFrames * 0.1),
      ).map((index) => frames[index]);

      setDisplayedFrames(framesAtIntervals);
    },
    [frames],
  );

  const generateFramesFromVideo = (video: HTMLVideoElement) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = canvas.width;
    const height = canvas.height;

    const totalFrames = Math.floor(video.duration / 2);
    const interval = 2; // Capture a frame every 2 seconds

    const frameContainer = document.getElementById('frameContainer');

    let currentFrame = 0;

    const generateFrame = () => {
      if (currentFrame >= totalFrames) return;

      video.currentTime = currentFrame * interval;
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, width, height);
        const data = canvas.toDataURL('image/jpeg');

        const img = document.createElement('img');
        img.src = data;
        img.className = 'pointer-events-none';

        frameContainer?.appendChild(img);

        currentFrame++;
        requestAnimationFrame(generateFrame);
        setFrames((prevFrames) => [...prevFrames, data]);
      };
    };

    video.currentTime = 0;
    requestAnimationFrame(generateFrame);
  };

  const handleFileDragNDrop = useCallback(
    (file: File) => {
      console.log(file);
      selectFile && selectFile(file);
      const url = URL.createObjectURL(file);

      // Create a video element
      const video = document.createElement('video');
      videoRef.current = video;
      // When the metadata is loaded, log the duration
      video.onloadedmetadata = () => {
        generateFramesFromVideo(video);
      };

      // Set the source of the video element to the uploaded file
      video.src = url;

      setDraggedFile(undefined);
    },
    [selectFile, setDraggedFile],
  );

  const preventDefaults = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      preventDefaults(e);
      if (draggedFile) handleFileDragNDrop(draggedFile);
    },
    [handleFileDragNDrop, draggedFile, preventDefaults],
  );

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef?.current || !timelineRef?.current) return;

    const timelineWidth = timelineRef.current.offsetWidth;
    const clickPosition = e.clientX - timelineRef.current.getBoundingClientRect().left;
    const time = (clickPosition / timelineWidth) * videoRef.current.duration;

    videoRef.current.currentTime = time;

    console.log(time);
  }, []);

  return (
    <div
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDrop={handleDrop}
      ref={timelineRef}
      onClick={handleScrub}
      className="h-full"
    >
      {/*TimeLine*/}
      {!!frames.length && frames.map((frame, index) => <img key={index} src={frame} alt="scrub" />)}
    </div>
    <>
      <div
        onClick={handleClick}
        onDragEnter={preventDefaults}
        onDragOver={preventDefaults}
        onDrop={handleDrop}
        ref={timelineRef}
        className="h-full"
      >
        <canvas id="canvas" width="500" height="300" className="hidden"></canvas>
        <div id="frameContainer" className="h-2/5 flex overflow-x-scroll"></div>
      </div>
      <input
        type="range"
        min="10"
        max={frames.length}
        value={displayedFrames}
        onChange={handleSliderChange}
      />
    </>
  );
};
