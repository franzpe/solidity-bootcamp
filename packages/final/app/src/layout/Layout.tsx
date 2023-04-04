import Header from '@/components/Header';
import { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;
