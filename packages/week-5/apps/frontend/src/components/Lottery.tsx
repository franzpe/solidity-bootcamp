import { Text } from '@nextui-org/react';
import { BigNumber, Contract } from 'ethers';
import { useEffect, useState } from 'react';

type Props = {
  lotteryContract: Contract;
};

const Lottery = ({ lotteryContract }: Props) => {
  const [{ isOpen, closingTime }, setInfo] = useState({ isOpen: false, closingTime: new Date() });

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
      <h1>Dwight Schrute Lotter</h1>
      <p>
        State:{' '}
        <Text i color={isOpen ? 'success' : 'error'}>
          {isOpen ? 'open' : 'closed'}
        </Text>
      </p>
      {isOpen && (
        <p>
          Closing time: <Text i>{closingTime.toLocaleString()}</Text>
        </p>
      )}
    </div>
  );
};

export default Lottery;
