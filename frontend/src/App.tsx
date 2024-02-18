import { ChangeEvent, useState } from 'react';
import { DropZone } from './components/DragZone.tsx';
import { DropDown } from './components/Dropdown.tsx';
import { FileUpload } from './components/FileUpload.tsx';
import {
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  FileUploadIcon,
} from './assets/icons';

const testingCenters = [
  {
    id: 1,
    name: 'Testing Center 1',
  },
  {
    id: 2,
    name: 'Testing Center 2',
  },
  {
    id: 3,
    name: 'Testing Center 3',
  },
  {
    id: 4,
    name: 'Testing Center 4',
  },
];

function App() {
  const [fileList, setFileList] = useState<FileList>();
  const [toleranceWindow, setToleranceWindow] = useState(false);
  const [currentlyOpen, setCurrentlyOpen] = useState<number | null>(0);
  const [splitSchedule, setSplitSchedule] = useState<string>();
  const [clientType, setClientType] = useState<string>();

  const handleToleranceWindow = () => {
    setToleranceWindow(!toleranceWindow);
  };

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
      toleranceWindow,
      splitSchedule,
      clientType,
      currentlyOpen,
    });
  };

  return (
    <>
      <main className="p-4 md:p-8 relative">
        <button
          id="closingModal"
          type="button"
          onClick={() => handleClose}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-800 text-white absolute left-8"
        >
          {CloseIcon}
        </button>

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
                <button className="mt-4 self-center bg-blue-800 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
                  Upload Manifest
                </button>
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
              <h3>Tolerance Window:</h3>
              <div className="flex items-center">
                <div
                  className={`w-8 h-4 rounded-full p-1 cursor-pointer relative mr-2 bg-blue-800 ${toleranceWindow ? 'bg-blue-800' : 'bg-gray-400'}`}
                  onClick={() => handleToleranceWindow()}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full ${toleranceWindow ? 'translate-x-4' : 'translate-x-0'}`}
                  ></div>
                </div>
                Toggle {toleranceWindow ? 'ON' : 'OFF'}{' '}
                <span className="mx-4">|</span> {ClockIcon} Select Tolerance
                Level
              </div>
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
              <ul className="list-none p-0 m-0">
                {testingCenters.map((center) => (
                  <li
                    key={center.id}
                    className="flex justify-between items-center py-2"
                  >
                    <p>{center.name}</p>
                    <DropDown
                      key={center.id}
                      clientCenter={center}
                      currentlyOpen={currentlyOpen}
                      setCurrentlyOpen={setCurrentlyOpen}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <footer className="mt-8">
        <h2 className="text-center text-blue-800 my-4">
          Data in import file is correct. Please press continue to import.
        </h2>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleOnSubmit}
            className="bg-blue-800 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            id="continueBtn"
          >
            Continue Import
          </button>
          <button
            className="text-orange-600 bg-transparent border border-orange-600 py-2 px-6 rounded-lg hover:bg-orange-600 hover:text-white"
            id="cancelBtn"
          >
            Cancel
          </button>
        </div>
      </footer>
    </>
  );
}

export default App;
