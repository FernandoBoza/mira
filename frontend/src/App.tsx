import { useState } from 'react';
import { DropZone, FileUploadProgress } from './components/upload';
import { Button } from '@/components/ui/button.tsx';
import { FileUploadIcon } from './assets/icons';

function App() {
  const [fileList, setFileList] = useState<FileList>();

  const handleFileDrop = (files: FileList) => {
    files && setFileList(files);
  };

  const handleOnSubmit = () => {
    console.log(fileList);
  };

  return (
    <>
      <main className="p-4 md:p-8 relative">
        <h1 className="text-blue-800 mx-auto text-center mb-4 border-b border-gray-300 pb-4">
          Document Upload
        </h1>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="border-t border-gray-300 pt-4">
              Select a file that you'd like to import
            </h3>
            <div className="border border-gray-300 rounded-lg p-4 flex flex-col">
              <DropZone
                onFileDrop={(files: FileList) => handleFileDrop(files)}
              />
              <Button className="self-center">Upload Manifest</Button>
            </div>
          </div>

          {fileList && (
            <div className="flex gap-4 items-center mt-4 pt-4 border-t border-gray-200">
              {FileUploadIcon}
              <FileUploadProgress fileList={fileList} />
            </div>
          )}
        </div>
      </main>
      <footer className="mt-8">
        <h2 className="text-center text-blue-800 my-4">
          Data in import file is correct. Please press continue to import.
        </h2>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={handleOnSubmit} id="continueBtn">
            Continue Import
          </Button>
        </div>
      </footer>
    </>
  );
}

export default App;
