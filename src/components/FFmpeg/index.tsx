import { useEffect, useRef, useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import vidUrl from '../../assets/2020NYE.mp4';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

const vidObj = {
  vidUrl,
  sample: 'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm',
};

export const FFMpeg = () => {
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [frames, setFrames] = useState<string[]>([]);

  const commands = ['-i', 'input.mp4', '-vf', 'fps=0.5,scale=-1:480', 'out%d.jpg'];

  // This function loads a resource from the cache
  async function loadCache(url: string) {
    const cache = await caches.open('ffmpeg-cache');
    const response = await cache.match(url);
    if (response) {
      console.log('from cache', url);
      return response.url;
    } else {
      console.log('external call', url);
      const networkResponse = await fetch(url);
      await cache.put(url, networkResponse.clone());
      return URL.createObjectURL(await networkResponse.blob());
    }
  }

  useEffect(() => {
    const load = async () => {
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on('log', ({ message }) => {
        if (messageRef.current) messageRef.current.innerHTML = message;
        console.log(message);
      });

      await ffmpeg.load({
        coreURL: await loadCache('https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js'),
        wasmURL: await loadCache('https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm'),
      });
    };
    load().then(() => console.log('loaded'));
  }, []);

  const transcode = async () => {
    try {
      const ffmpeg = ffmpegRef.current;
      const fileData = await fetchFile(vidObj.vidUrl);
      await ffmpeg.writeFile('input.mp4', new Uint8Array(fileData));
      await ffmpeg.exec(commands, -1);
      const data = await ffmpeg.listDir('/');
      const jpgFiles = data.filter((file) => file.name.endsWith('.jpg'));
      const frames = await Promise.all(
        jpgFiles.map(async (file) => {
          const data = await ffmpeg.readFile(file.name);
          let binary = '';
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const bytes = new Uint8Array(data);
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = window.btoa(binary);
          return `data:image/jpg;base64,${base64}`;
        }),
      );
      setFrames(frames);
      console.log(frames);
    } catch (error) {
      console.error(error);
    }
  };

  const transcode2 = async () => {
    try {
      const ffmpeg = ffmpegRef.current;
      const fileData = await fetchFile(vidObj.vidUrl);
      await ffmpeg.writeFile('input.mp4', new Uint8Array(fileData));

      // Simplified chunk processing example
      // Assuming 10 second chunks for a 60 second video (for demonstration)
      const chunkLength = 10; // seconds
      const videoDuration = 60; // should be dynamically determined
      const numberOfChunks = Math.ceil(videoDuration / chunkLength);
      const processedFrames = [];

      for (let i = 0; i < numberOfChunks; i++) {
        const startTime = i * chunkLength;
        const commands = [
          '-ss',
          `${startTime}`,
          '-t',
          `${chunkLength}`,
          '-i',
          'input.mp4',
          '-vf',
          'fps=0.5,scale=-1:480',
          `output_${i}_%d.jpg`,
        ];

        await ffmpeg.exec(commands);

        const jpgFiles = await ffmpeg.ls(`/output_${i}_`);
        for (const file of jpgFiles) {
          const data = await ffmpeg.readFile(file);
          let binary = '';
          const bytes = new Uint8Array(data);
          for (let j = 0; j < bytes.byteLength; j++) {
            binary += String.fromCharCode(bytes[j]);
          }
          const base64 = window.btoa(binary);
          processedFrames.push(`data:image/jpg;base64,${base64}`);
        }
      }

      setFrames(processedFrames);
    } catch (error) {
      console.error('Error during video processing:', error);
    }
  };

  return (
    <>
      {frames.length === 0 ? (
        <>
          <video ref={videoRef} controls></video>
          <br />
          <button onClick={transcode2}>Transcode avi to mp4</button>
          <p ref={messageRef}></p>
        </>
      ) : (
        <ScrollArea className="">
          <div className="flex overflow-x-scroll">
            {!!frames.length &&
              frames.map((frame, index) => (
                <img key={index} className="w-96" src={frame} alt="scrub" />
              ))}
          </div>
        </ScrollArea>
      )}
    </>
  );
};
