import { DropZone } from './components/upload';
import { ModeToggle } from '@/components/layout/mode-toggle.tsx';

function App() {
  return (
    <div className="p-8">
      <ModeToggle />
      <DropZone />
    </div>
  );
}

export default App;
