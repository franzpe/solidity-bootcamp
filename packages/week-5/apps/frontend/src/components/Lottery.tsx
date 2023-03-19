import { Button, Input, Loading, Row, Text } from '@nextui-org/react';
import { BigNumber, Contract, providers } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useMetamaskContext } from '../hooks/MetamaskContext';
import useCountdown from '../hooks/useCountdown';

type Props = {
  lotteryContract: Contract;
};

const Lottery = ({ lotteryContract }: Props) => {
  const { provider } = useMetamaskContext();
  const [{ isLoaded, isOpen, closingTime, prizePool, ratio }, setInfo] = useState({
    isOpen: false,
    closingTime: new Date(),
    prizePool: 0,
    ratio: 0,
    isLoaded: false
  });

  const [openingDuration, setOpeningDuration] = useState('');
  const [isOpening, setIsOpening] = useState(false);
  const [days, hours, minutes, seconds] = useCountdown(closingTime);

  useEffect(() => {
    lotteryContract.betsOpen().then((state: boolean) => {
      setInfo(prev => ({ ...prev, isLoaded: true, isOpen: state }));
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

  const handleOpen = async () => {
    setIsOpening(true);

    if (isOpen) {
      lotteryContract
        .connect(provider!.getSigner())
        .closeLottery()
        .then(async (tx: any) => {
          await tx.wait();
          toast.success('Lottery closed');
          setIsOpening(false);
          setInfo(prev => ({ ...prev, isOpen: false }));
        })
        .catch((err: any) => toast.error(err));
    } else {
      const currentBlock = await provider!.getBlock('latest');

      lotteryContract
        .connect(provider!.getSigner())
        .openBets(currentBlock.timestamp + Number(openingDuration), { gasLimit: 100000 })
        .then(async (tx: any) => {
          await tx.wait();
          setInfo(prev => ({ ...prev, isOpen: true }));
          setIsOpening(false);
          toast.success('Lottery opened');
        })
        .catch((err: any) => toast.error(err));
    }
  };

  const countdownElapsed = days + hours + minutes + seconds <= 0;

  const canBet = !countdownElapsed && isOpen;

  if (!isLoaded) return <Loading type="spinner" color="currentColor" size="xl" />;

  return (
    <div>
      <h1>Dwight Schrute Lottery</h1>
      <Row css={{ display: 'flex', alignItems: 'center' }}>
        State:&nbsp;
        <Text i color={isOpen ? 'success' : 'error'}>
          {isOpen ? 'open' : 'closed'}
        </Text>
        {!isOpen && (
          <Input
            bordered
            labelRight="seconds"
            placeholder="Lottery duration"
            aria-label="Lottery duration"
            type="number"
            css={{ marginLeft: '20px' }}
            value={openingDuration}
            onChange={e => setOpeningDuration(e.target.value)}
          />
        )}
        <Button
          color="secondary"
          auto
          size="xs"
          disabled={isOpening}
          onPress={handleOpen}
          css={{ display: 'inline-block', marginLeft: '12px' }}
        >
          {!isOpening ? isOpen ? 'Close' : 'Open' : <Loading type="spinner" color="currentColor" size="xs" />}
        </Button>
      </Row>
      {isOpen && (
        <>
          <p>
            Bets closing time: <Text i>{closingTime.toLocaleString()}</Text>
          </p>
          <p>
            Countdown:{' '}
            <Text i>
              {countdownElapsed ? (
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
          <form></form>
        </>
      )}
    </div>
  );
};

export default Lottery;
