import { createLazyFileRoute } from '@tanstack/react-router';
import App from '@/App.tsx';
import Page from '@/pages';

export const Route = createLazyFileRoute('/')({
  errorComponent: () => <div>Error</div>,
  component: () => (
    <Page>
      <App />
    </Page>
  ),
});
