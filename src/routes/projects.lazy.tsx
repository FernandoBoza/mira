import { createLazyFileRoute } from '@tanstack/react-router';
import Page from '@/pages';

export const Route = createLazyFileRoute('/projects')({
  component: () => <Page>Hello /projects!</Page>,
});
