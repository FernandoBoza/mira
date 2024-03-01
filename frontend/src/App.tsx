import { useEffect, useMemo } from 'react';
import { FolderOpenDot, Images, PencilRuler } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { Link } from '@tanstack/react-router';

export default function App() {
  const worker = useMemo(
    () =>
      new Worker(new URL('./web.worker.ts', import.meta.url), {
        type: 'module',
      }),
    [],
  );

  useEffect(() => {
    worker.onmessage = (event) => console.log('Worker said:', event.data);
    worker.postMessage('Hello World');
    return () => worker.terminate();
  }, [worker]);

  const iconSize = ['stroke-1 h-10 w-10', 'text-3xl scale-125'];

  const categories = [
    {
      name: 'Gallery',
      icon: <Images className={iconSize[0]} />,
      url: '/gallery',
    },
    {
      name: 'Editor',
      icon: <PencilRuler className={iconSize[0]} />,
      url: '/editor',
    },
    {
      name: 'Projects',
      icon: <FolderOpenDot className={iconSize[0]} />,
      url: '/projects',
    },
    {
      name: 'Help',
      icon: <span className={iconSize[1]}>🤷</span>,
      url: '/help',
    },
  ];

  return (
    <div className="flex w-full gap-2">
      {categories.map((category) => (
        <Link className="grow w-1/5" to={category.url} key={category.name}>
          <Card className="h-40 text-center">
            <CardHeader className="items-center">{category.icon}</CardHeader>
            <CardContent>
              <h1 className="font-semibold text-2xl">{category.name}</h1>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
