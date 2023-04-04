import { useRouter } from 'next/router';

const Battle = () => {
  const { query } = useRouter();

  return (
    <div>
      <h2>Battle {query.battle}</h2>
    </div>
  );
};

export default Battle;
