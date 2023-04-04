import Battle from '@/components/Battle';
import Layout from '@/layout/Layout';
import { useRouter } from 'next/router';

const BattleContainer = () => {
  const { query } = useRouter();

  if (!query.battle) return null;

  return (
    <Layout>
      <Battle id={query.battle} />
    </Layout>
  );
};

export default BattleContainer;
