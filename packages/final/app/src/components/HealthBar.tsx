import { memo, useEffect, useState } from 'react';

type Props = {
  hpTotal: number;
  hpLeft: number;
  damage: number;
};

const HealthBar = ({ hpTotal, hpLeft, damage }: Props) => {
  const [state, setState] = useState({ hitWidth: 100, barWidth: 100, hpLeft });

  useEffect(() => {
    setTimeout(() => {
      setState(prev => ({ ...prev, barWidth: (hpLeft / hpTotal) * 100, hitWidth: 0 }));
    }, 500);

    setState(prev => ({
      ...prev,
      hitWidth: (damage / prev.hpLeft) * 100 > prev.barWidth ? 100 : (damage / prev.hpLeft) * 100,
      hpLeft,
    }));
  }, [hpLeft]);

  return (
    <div className="health-bar rounded-lg bg-gray-100">
      <div className="bar rounded-lg" style={{ width: state.barWidth + '%' }}>
        <div className="hit rounded-lg" style={{ width: state.hitWidth + '%' }}></div>
      </div>
    </div>
  );
};

export default memo(HealthBar);
