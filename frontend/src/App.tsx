import { DropZone } from './components/upload';

function App() {
  return (
    <>
      <main className="p-4 md:p-8 relative">
        <h1 className="text-blue-800 mx-auto text-center mb-4 pb-4">
          Document Upload
        </h1>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="border border-gray-300 rounded-lg p-4 flex flex-col">
              <DropZone />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
