import { Button, Input, Loading, Row, Text } from '@nextui-org/react';
import { BigNumber, Contract, ethers } from 'ethers';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useMetamaskContext } from '../hooks/MetamaskContext';
import useCountdown from '../hooks/useCountdown';

type Props = {
  lotteryContract: Contract;
  tokenContract: Contract;
};

const Lottery = ({ lotteryContract, tokenContract }: Props) => {
  const { provider, address } = useMetamaskContext();
  const [{ isLoaded, isOpen, closingTime, prizePool, ratio, prize, prizeLoaded }, setInfo] = useState({
    isOpen: false,
    closingTime: new Date(),
    prizePool: 0,
    ratio: 0,
    isLoaded: false,
    prize: 0,
    prizeLoaded: false
  });

  const [openingDuration, setOpeningDuration] = useState('');
  const [isOpening, setIsOpening] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [days, hours, minutes, seconds] = useCountdown(closingTime);
  const [betForm, setBetForm] = useState({ value: 0, isLoading: false });

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
        setInfo(prev => ({ ...prev, prizePool: Number(ethers.utils.formatEther(prizePoolBN)) }));
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

  const handleBet = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setBetForm({ ...betForm, isLoading: true });

      const signer = provider!.getSigner();

      const allowTx = await tokenContract
        .connect(signer)
        .approve(lotteryContract.address, ethers.constants.MaxUint256);
      await allowTx.wait();

      const tx = await lotteryContract.connect(signer).betMany(betForm.value);
      await tx.wait();

      toast.success('Bet succesfully placed');

      lotteryContract.prizePool().then((prizePoolBN: BigNumber) => {
        setInfo(prev => ({ ...prev, prizePool: prizePoolBN.toNumber() }));
      });
    } catch (err) {
      console.log(err);
      toast.error('Yaiks! Error occured');
    } finally {
      setBetForm({ ...betForm, isLoading: false });
    }
  };

  const handleShowPrize = async () => {
    try {
      const prizeBN = await lotteryContract.prize(address);
      const prize = Number(ethers.utils.formatEther(prizeBN));
      setInfo(prev => ({ ...prev, prize: prize, prizeLoaded: true }));

      if (prize > 0) {
        toast.success("Congratulations! You've won!");
      }
    } catch (err) {
      console.log(err);
      toast.error('Yaiks! Error occured');
    }
  };

  const handleClaimPrize = async () => {
    try {
      setIsClaiming(false);
      const tx = await lotteryContract
        .connect(provider!.getSigner())
        .prizeWithdraw(ethers.utils.parseEther(prize.toString()));
      await tx.wait();
      toast.success('Withdrawal complete');
    } catch (err) {
      console.log(err);
      toast.error('Yaiks! Error occured');
    } finally {
      setIsClaiming(false);
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

          {canBet && (
            <Row css={{ display: 'flex', alignItems: 'center', marginTop: '8px', marginBottom: '8px' }}>
              <form onSubmit={handleBet}>
                <Input
                  bordered
                  labelRight="TK0"
                  placeholder="Bet"
                  aria-label="Bet"
                  type="number"
                  value={betForm.value}
                  onChange={e => setBetForm(prev => ({ ...prev, value: Number(e.target.value) }))}
                />
                <Button
                  color="secondary"
                  auto
                  size="md"
                  disabled={betForm.isLoading}
                  type="submit"
                  css={{ display: 'inline-block', marginLeft: '12px' }}
                >
                  {!betForm.isLoading ? 'Place bet' : <Loading type="spinner" color="currentColor" size="md" />}
                </Button>
              </form>
            </Row>
          )}
        </>
      )}
      <Row css={{ display: 'flex', alignItems: 'center', marginBottom: '8px', marginTop: '8px' }}>
        <Button css={{ marginRight: '16px' }} onClick={handleShowPrize}>
          Show prize
        </Button>
        {prizeLoaded && (
          <span>
            You've won:<Text i> {prize} LT0 </Text>
          </span>
        )}
        {prize > 0 && (
          <Button css={{ marginLeft: '12px' }} auto size="xs" onClick={handleClaimPrize} disabled={isClaiming}>
            {!isClaiming ? 'Claim' : <Loading type="spinner" color="currentColor" size="xs" />}
          </Button>
        )}
      </Row>
    </div>
  );
};

export default Lottery;
