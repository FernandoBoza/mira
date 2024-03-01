import { useState, useRef } from 'react';
import { PlayIcon, PauseIcon, Volume2, VolumeX, Expand } from 'lucide-react';

export const VideoPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = async () => {
    const video = videoRef?.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullScreen = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) {
      try {
        await video.requestFullscreen();
      } catch (err) {
        if (err instanceof DOMException) {
          console.log(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
          );
        }
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (err) {
        if (err instanceof DOMException) {
          console.error(
            `Error attempting to exit full-screen mode: ${err.message} (${err.name})`,
          );
        }
      }
    }
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        className="w-full"
        onClick={togglePlayPause}
      />
      <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4 bg-gray-900 bg-opacity-50">
        <button onClick={togglePlayPause} className="text-white">
          {isPlaying ? (
            <PauseIcon className="w-6 h-6" />
          ) : (
            <PlayIcon className="w-6 h-6" />
          )}
        </button>
        <div className="flex items-center">
          <button onClick={toggleMute} className="text-white mr-4">
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
          <button onClick={toggleFullScreen} className="text-white">
            <Expand className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
