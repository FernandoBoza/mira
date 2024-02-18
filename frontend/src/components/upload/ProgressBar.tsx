import { formatBytes } from '../../../../utils';

type ProgressBarProps = {
  file: any;
  progress: number;
};

export const ProgressBar = ({ file, progress }: ProgressBarProps) => (
  <div id="progressRow">
    <p key={file.name} className="flex justify-between gap-3">
      <span id="fileName">{file.name.slice(0, 20)}... </span>
      <span id="fileSize">{formatBytes(file.size)}</span>
    </p>
    <progress
      className="w-full"
      value={progress}
      id="progressBar"
      max="100"
    ></progress>
  </div>
);
