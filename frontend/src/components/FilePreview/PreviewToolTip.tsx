import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { FilePreview } from '@/components/FilePreview/index.tsx';

type PreviewToolTipProps = {
  trigger: React.ReactNode;
  file: File;
};

export const PreviewToolTip = ({ trigger, file }: PreviewToolTipProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side="bottom" align="start">
        <FilePreview file={file} />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
