import { createLazyFileRoute } from '@tanstack/react-router';
import Page from '@/Pages';

export const Route = createLazyFileRoute('/projects')({
  component: () => <Page>Hello /projects!</Page>,
});
