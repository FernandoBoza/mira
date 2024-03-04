import { createLazyFileRoute } from '@tanstack/react-router';
import Page from '@/pages';
import { EditorPage } from '@/pages/Editor.page.tsx';

export const Route = createLazyFileRoute('/editor')({
  component: () => <Page><EditorPage /></Page>
});
