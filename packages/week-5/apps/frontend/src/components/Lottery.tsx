import { Text } from '@nextui-org/react';
import { BigNumber, Contract } from 'ethers';
import { useEffect, useState } from 'react';
import useCountdown from '../hooks/useCountdown';

type Props = {
  lotteryContract: Contract;
};

const Lottery = ({ lotteryContract }: Props) => {
  const [{ isOpen, closingTime }, setInfo] = useState({ isOpen: false, closingTime: new Date() });
  const [days, hours, minutes, seconds] = useCountdown(closingTime);

  useEffect(() => {
    lotteryContract.betsOpen().then((state: boolean) => {
      setInfo(prev => ({ ...prev, isOpen: state }));
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      lotteryContract.betsClosingTime().then((closingTimeBN: BigNumber) => {
        const closingTime = new Date(closingTimeBN.toNumber() * 1000);
        setInfo(prev => ({ ...prev, closingTime: closingTime }));
      });
    }
  }, [isOpen]);

  return (
    <div>
      <h1>Dwight Schrute Lottery</h1>
      <p>
        State:{' '}
        <Text i color={isOpen ? 'success' : 'error'}>
          {isOpen ? 'open' : 'closed'}
        </Text>
      </p>
      {isOpen && (
        <>
          <p>
            Bets closing time: <Text i>{closingTime.toLocaleString()}</Text>
          </p>
          <p>
            Countdown:{' '}
            <Text i>
              {days + hours + minutes + seconds <= 0 ? (
                'Bets closed'
              ) : (
                <>
                  {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
                </>
              )}
            </Text>
          </p>
        </>
      )}
    </div>
  );
};

export default Lottery;
