import Game from '@/components/Game';
import Layout from '@/layout/Layout';
import { useSession } from 'next-auth/react';

export default function IndexPage() {
  const { data, status } = useSession();

  if (!data || status !== 'authenticated') {
    return null;
  }

  return (
    <Layout>
      <Game />
    </Layout>
  );
}
