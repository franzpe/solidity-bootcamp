import { PropsWithChildren } from 'react';
import Box from './Box';
import Header from './Header';

export const Layout = ({ children }: PropsWithChildren) => (
  <Box
    css={{
      maxW: '100%'
    }}
  >
    <Header />
    {children}
  </Box>
);
