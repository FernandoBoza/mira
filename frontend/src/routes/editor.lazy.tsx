import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/editor')({
  component: () => <div>Hello /editor!</div>,
});
