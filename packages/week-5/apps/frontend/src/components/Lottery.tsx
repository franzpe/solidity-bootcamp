import { Text } from '@nextui-org/react';
import { BigNumber, Contract } from 'ethers';
import { useEffect, useState } from 'react';
import useCountdown from '../hooks/useCountdown';

type Props = {
  lotteryContract: Contract;
};

const Lottery = ({ lotteryContract }: Props) => {
  const [{ isOpen, closingTime, prizePool, ratio }, setInfo] = useState({
    isOpen: false,
    closingTime: new Date(),
    prizePool: 0,
    ratio: 0
  });
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
      lotteryContract.prizePool().then((prizePoolBN: BigNumber) => {
        setInfo(prev => ({ ...prev, prizePool: prizePoolBN.toNumber() }));
      });
      lotteryContract.purchaseRatio().then((ratioBN: BigNumber) => {
        setInfo(prev => ({ ...prev, ratio: ratioBN.toNumber() }));
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
          <p>
            Prize pool:{' '}
            <Text i>
              {prizePool} LT0 - {prizePool / ratio} ETH
            </Text>
          </p>
        </>
      )}
    </div>
  );
};

export default Lottery;
