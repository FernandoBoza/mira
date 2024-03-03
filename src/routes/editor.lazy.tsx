import { createLazyFileRoute } from '@tanstack/react-router';
import Page from '@/pages';

export const Route = createLazyFileRoute('/editor')({
  component: () => <Page>Hello /editor!</Page>,
});
