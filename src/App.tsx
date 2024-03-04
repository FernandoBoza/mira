import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { Link } from '@tanstack/react-router';
import { GradientIcon } from '@/assets/icons.tsx';
import { FolderOpenDot, PencilRuler } from 'lucide-react';

const categories = [
  {
    name: 'Editor',
    icon: PencilRuler,
    url: '/editor'
  },
  {
    name: 'Projects',
    icon: FolderOpenDot,
    url: '/projects'
  },
  {
    name: 'Help',
    icon: '🤷',
    url: '/help'
  }
];

export default function App() {
  const worker = useMemo(
    () =>
      new Worker(new URL('./web.worker.ts', import.meta.url), {
        type: 'module'
      }),
    []
  );

  useEffect(() => {
    worker.onmessage = (event) => console.log('Worker said:', event.data);
    worker.postMessage('Hello World');
    return () => worker.terminate();
  }, [worker]);

  return (
    <div className="flex w-full gap-2">
      {categories.map((category) => (
        <Link className="grow w-1/5" to={category.url} key={category.name}>
          <Card className="h-40 text-center">
            <CardHeader className="items-center">
              {typeof category.icon === 'string' ? (
                <span className="text-3xl scale-125">{category.icon}</span>
              ) : (
                <GradientIcon Icon={category.icon} />
              )}
            </CardHeader>
            <CardContent>
              <h1 className="font-semibold text-xl">{category.name}</h1>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
