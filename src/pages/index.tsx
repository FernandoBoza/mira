import { Toaster } from '@/components/ui/sonner.tsx';
import { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
  className?: string;
};

export default function Page({ children, className = 'px-4' }: PageProps) {
  return (
    <>
      <Toaster />
      <main className={`${className}`}>{children}</main>
    </>
  );
}
