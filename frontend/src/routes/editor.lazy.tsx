import { createLazyFileRoute } from '@tanstack/react-router';
import Page from '@/Pages';

export const Route = createLazyFileRoute('/editor')({
  component: () => <Page>Hello /editor!</Page>,
});
