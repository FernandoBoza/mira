import { Toaster } from '@/components/ui/sonner.tsx';

export default function Page({ children, className }) {
  return (
    <>
      <Toaster />
      <main className={`px-4 ${className}`}>{children}</main>
    </>
  );
}
