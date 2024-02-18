import { ReactElement } from 'react';

type LayoutProps = {
  header: ReactElement;
  footer: ReactElement;
  children: ReactElement;
};

export const Layout = ({ header, footer, children }: LayoutProps) => {
  return (
    <div>
      <header>{header}</header>
      <main>{children}</main>
      <footer>{footer}</footer>
    </div>
  );
};
