import { createLazyFileRoute } from '@tanstack/react-router';
import Page from '@/pages';

export const Route = createLazyFileRoute('/help')({
  component: () => <Page>Hello /help!</Page>,
});
