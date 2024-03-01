import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/gallery')({
  component: () => <div>Hello /gallery!</div>
})