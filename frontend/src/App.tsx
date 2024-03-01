import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { Images, FolderOpenDot, PencilRuler } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { Link } from '@tanstack/react-router';
import { ModeToggle } from '@/components/layout/mode-toggle.tsx';

export default function App() {
  const worker = new Worker(new URL('./web.worker.ts', import.meta.url), {
    type: 'module',
  });

  useEffect(() => {
    worker.onmessage = (event) => console.log('Worker said:', event.data);
    worker.postMessage('Hello World');
    return () => worker.terminate();
  }, [worker.onmessage]);

  const categories = [
    { name: 'Gallery', icon: <Images />, url: '/gallery' },
    { name: 'Editor', icon: <PencilRuler />, url: '/editor' },
    { name: 'Projects', icon: <FolderOpenDot />, url: '/projects' },
    { name: 'Help', icon: <span className="scale-150">🤷</span>, url: '/help' },
  ];

  return (
    <>
      <ModeToggle />
      <Toaster />
      {/*flex children should be the same width size*/}
      <div className="flex w-full gap-2 px-4">
        {categories.map((category) => (
          <Link className="grow w-1/5" to={category.url} key={category.name}>
            <Card className="h-40 text-center">
              <CardHeader className="items-center">{category.icon}</CardHeader>
              <CardContent>
                <h1>{category.name}</h1>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
