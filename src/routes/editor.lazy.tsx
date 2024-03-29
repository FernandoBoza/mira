import { createLazyFileRoute } from '@tanstack/react-router';
import Page from '@/pages';
import EditorPage from '@/pages/Editor.page.tsx';

export const Route = createLazyFileRoute('/editor')({
  component: () => (
    <Page className="p-0 h-[92.5vh] h-xl:h-[94.5vh]">
      <EditorPage />
    </Page>
  ),
});
