import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { Link } from '@tanstack/react-router';
import { GradientIcon } from '@/assets/icons.tsx';
import { FolderOpenDot, PencilRuler } from 'lucide-react';

export const pages = [
  {
    name: 'Gallery',
    icon: PencilRuler,
    url: '/gallery',
  },
  {
    name: 'Editor',
    icon: FolderOpenDot,
    url: '/editor',
  },
  {
    name: 'Help',
    icon: '🤷',
    url: '/help',
  },
];

export default function App() {
  const worker = useMemo(
    () => new Worker(new URL('./web.worker.ts', import.meta.url), { type: 'module' }),
    [],
  );

  useEffect(() => {
    // worker.onmessage = (event) => {
    //   // Handle the frames data
    //   const frames = event.data;
    // };
    //
    // // Send the video file to the worker
    // worker.postMessage(videoFile);

    worker.onmessage = (event) => console.log('Worker said:', event.data);
    worker.postMessage('Hello World');
    return () => worker.terminate();
  }, [worker]);

  return (
    <div className="flex w-full gap-2">
      {pages.map((page) => (
        <Link className="grow w-1/5" to={page.url} key={page.name}>
          <Card className="h-40 text-center">
            <CardHeader className="items-center">
              {typeof page.icon === 'string' ? (
                <span className="text-3xl scale-125">{page.icon}</span>
              ) : (
                <GradientIcon Icon={page.icon} />
              )}
            </CardHeader>
            <CardContent>
              <h1>{page.name}</h1>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
