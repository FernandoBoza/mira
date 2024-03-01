import { createLazyFileRoute } from '@tanstack/react-router';
import App from '@/App.tsx';

export const Route = createLazyFileRoute('/')({
  errorComponent: () => <div>Error</div>,
  component: () => <App />,
});
