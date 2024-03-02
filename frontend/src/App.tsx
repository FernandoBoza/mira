import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { Link } from '@tanstack/react-router';
import { GradientIcon } from '@/assets/icons.tsx';
import { FolderOpenDot, Images, LucideIcon, PencilRuler } from 'lucide-react';

const categories = [
  {
    name: 'Gallery',
    icon: Images,
    url: '/gallery',
    type: 'icon',
  },
  {
    name: 'Editor',
    icon: PencilRuler,
    url: '/editor',
    type: 'icon',
  },
  {
    name: 'Projects',
    icon: FolderOpenDot,
    url: '/projects',
    type: 'icon',
  },
  {
    name: 'Help',
    icon: '🤷',
    url: '/help',
    type: 'span',
  },
];

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

  return (
    <div className="flex w-full gap-2">
      {categories.map((category) => (
        <Link className="grow w-1/5" to={category.url} key={category.name}>
          <Card className="h-40 text-center">
            <CardHeader className="items-center">
              {category.type === 'icon' ? (
                <GradientIcon Icon={category.icon as LucideIcon} />
              ) : (
                <span className="text-3xl scale-125">
                  {category.icon as string}
                </span>
              )}
            </CardHeader>
            <CardContent>
              <h1 className="font-semibold text-2xl">{category.name}</h1>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
