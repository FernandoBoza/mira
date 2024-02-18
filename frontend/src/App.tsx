import { ChangeEvent, useState } from 'react';
import { DropZone, FileUpload } from './components/Upload';
import { Button } from '@/components/ui/button.tsx';
import { ChevronDownIcon, CloseIcon, FileUploadIcon } from './assets/icons';
import { ToggleIcon } from '@/components/ui/toggleIcon.tsx';

function App() {
  const [fileList, setFileList] = useState<FileList>();
  const [splitSchedule, setSplitSchedule] = useState<string>();
  const [clientType, setClientType] = useState<string>();

  const handleFileDrop = (files: FileList) => {
    files && setFileList(files);
  };

  const handleSplitSchedule = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setSplitSchedule(target.value);
  };

  const handleClientType = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setClientType(target.value);
  };

  const handleClose = () => {
    console.log('Closing');
  };

  const handleOnSubmit = () => {
    console.log({
      file: fileList,
      splitSchedule,
      clientType,
    });
  };

  return (
    <>
      <main className="p-4 md:p-8 relative">
        <Button className="absolute left-8" onClick={handleClose}>
          {CloseIcon}
        </Button>

        <h1 className="text-blue-800 mx-auto text-center mb-4 border-b border-gray-300 pb-4">
          Document Upload
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
          <div className="space-y-6">
            <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4 cursor-pointer mb-6">
              <h3>Select Import Name:</h3>
              {ChevronDownIcon}
            </div>

            <div className="space-y-4">
              <h3 className="border-t border-gray-300 pt-4">
                Select a manifest that you'd like to import
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
                <FileUpload fileList={fileList} />
              </div>
            )}

            <div
              className={`space-y-2 ${fileList ? 'border-t border-gray-300 pt-4' : ''}`}
            >
              <h3>Elapse Data Checking:</h3>
              <p className="text-green-600 font-bold">No Elapsed Dates!</p>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <ToggleIcon getValue={(val) => console.log(val)} />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3>Split schedule using social distancing?</h3>
              <div className="flex gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    onChange={handleSplitSchedule}
                    name="yesno"
                    type="radio"
                    value="yes"
                    className="radio radio-primary"
                  />
                  Yes
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    onChange={handleSplitSchedule}
                    name="yesno"
                    type="radio"
                    value="no"
                    className="radio radio-primary"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <h3>Location Checking:</h3>
              <p className="text-green-600 font-bold">All Available!</p>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <h3>Client:</h3>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    onChange={handleClientType}
                    name="clientType"
                    type="radio"
                    value="single"
                    className="radio radio-primary"
                  />
                  Single
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    onChange={handleClientType}
                    name="clientType"
                    type="radio"
                    value="multiple"
                    className="radio radio-primary"
                  />
                  Multiple
                </label>
              </div>
            </div>
          </div>
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
          <Button variant="outline" id="cancelBtn">
            Cancel
          </Button>
        </div>
      </footer>
    </>
  );
}

export default App;
