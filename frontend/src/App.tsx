import { DropZone } from './components/upload';

function App() {
  return (
    <>
      <main className="p-4 md:p-8 relative">
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
