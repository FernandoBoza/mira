import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilePreview } from '@/components/FilePreview';
import { formatBytes } from '@/lib/utils.ts';
import { format } from 'date-fns';

type TableViewProps = {
  files: File[] | FileList;
  selectFile?: (file?: File) => void;
  selectedFileName?: string;
};

export const TableView = ({ files, selectFile, selectedFileName }: TableViewProps) => {
  const handleFileSelection = (file: File) => {
    if (selectedFileName === file.name) {
      selectFile && selectFile(undefined);
      return '';
    } else {
      selectFile && selectFile(file);
      return file.name;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="hidden md:table-cell">Size</TableHead>
          <TableHead className="hidden md:table-cell">Created at</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...files].map((file) => (
          <TableRow
            key={`${file.name}`}
            onClick={() => handleFileSelection(file)}
            className={`cursor-pointer ${file.name === selectedFileName ? 'bg-primary/20 hover:bg-primary/20' : ''}`}
          >
            <TableCell className="hidden sm:table-cell">
              <FilePreview file={file} disablePlayBack={true} />
            </TableCell>
            <TableCell className="font-medium">{file.name}</TableCell>
            <TableCell className="hidden md:table-cell">{file.type}</TableCell>
            <TableCell className="hidden md:table-cell">{formatBytes(file.size)}</TableCell>
            <TableCell className="hidden md:table-cell">
              {format(file.lastModified, 'MM/dd/yyyy')}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontalIcon />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const MoreHorizontalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
