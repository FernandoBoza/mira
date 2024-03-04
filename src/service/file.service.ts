import { toast } from 'sonner';
import { getFileFormat } from '@/lib/utils.ts';
import { FileFilterType } from '@/lib/types.ts';

export default class FileService {
  constructor() {
  }

  public filterFiles = ({ files, uploadList, alreadyUploaded }: FileFilterType): FileList | File[] => {
    const newFiles = files instanceof FileList ? files : files?.target?.files;
    if (newFiles) {
      return [...newFiles].filter((file) => {
        if (!file.type.match(/image|video|pdf/)) {
          toast('Supported file types are image, video and pdf', {
            description: `${file.name} of type ${getFileFormat(file.type)} is not supported. `
          });
        }
        return (
          ![...uploadList, ...alreadyUploaded].some(
            (f) => f.name === file.name
          ) && file.type.match(/image|video|pdf/)
        );
      });
    }
    return [];
  };
}
