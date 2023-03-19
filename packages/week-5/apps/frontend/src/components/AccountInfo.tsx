import { Button, Grid, Input, Loading, Text } from '@nextui-org/react';
import { BigNumber, Contract, ethers } from 'ethers';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useMetamaskContext } from '../hooks/MetamaskContext';

type Props = {
  tokenContract: Contract | undefined;
  lotteryContract: Contract | undefined;
};

const AccountInfo = ({ tokenContract, lotteryContract }: Props) => {
  const { address, provider, status } = useMetamaskContext();
  const [info, setInfo] = useState({ balance: 0, tokenBalance: 0, ratio: 0, buyTokens: 0 });
  const [isBuying, setIsBuying] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  useEffect(() => {
    if (provider) {
      provider!.getBalance(address!).then((balanceBn: BigNumber) => {
        setInfo(prev => ({ ...prev, balance: Number(ethers.utils.formatEther(balanceBn)) }));
      });
    }
  }, [provider]);

  useEffect(() => {
    if (tokenContract) {
      tokenContract.balanceOf(address).then((balanceBn: BigNumber) => {
        setInfo(prev => ({ ...prev, tokenBalance: Number(ethers.utils.formatEther(balanceBn)) }));
      });
    }
  }, [tokenContract]);

  useEffect(() => {
    if (lotteryContract) {
      lotteryContract.purchaseRatio().then((ratioBN: BigNumber) => {
        setInfo(prev => ({ ...prev, ratio: ratioBN.toNumber() }));
      });
    }
  }, [lotteryContract]);

  const handleBuy = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsBuying(true);

    lotteryContract!
      .connect(provider!.getSigner())
      .purchaseTokens({ value: ethers.utils.parseEther((info.buyTokens / info.ratio).toString()) })
      .then(async (tx: any) => {
        await tx.wait();
        toast.success('Purchase transaction successful');

        const [balanceBN, tokenBalanceBN] = await Promise.all([
          provider!.getBalance(address!),
          tokenContract!.balanceOf(address)
        ]);

        setInfo(prev => ({
          ...prev,
          balance: Number(ethers.utils.formatEther(balanceBN)),
          tokenBalance: Number(ethers.utils.formatEther(tokenBalanceBN)),
          buyTokens: 0
        }));
      })
      .finally(() => setIsBuying(false));
  };

  const handleBurn = async () => {
    setIsBurning(true);

    try {
      const allowTx = await tokenContract!
        .connect(provider!.getSigner())
        .approve(lotteryContract!.address, ethers.constants.MaxUint256);
      await allowTx.wait();

      const tx = await lotteryContract!
        .connect(provider!.getSigner())
        .returnTokens(ethers.utils.parseEther(info.buyTokens.toString()));

      await tx.wait();

      const [balanceBN, tokenBalanceBN] = await Promise.all([
        provider!.getBalance(address!),
        tokenContract!.balanceOf(address)
      ]);

      setInfo(prev => ({
        ...prev,
        balance: Number(ethers.utils.formatEther(balanceBN)),
        tokenBalance: Number(ethers.utils.formatEther(tokenBalanceBN)),
        buyTokens: 0
      }));

      toast.success('burn transaction successful');
    } catch (err) {
      console.log(err);
    } finally {
      setIsBurning(false);
    }

    console.log('burn');
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <p>
        Wallet status:{' '}
        <Text i color={status === 'connected' ? 'success' : 'error'}>
          {status}
        </Text>
      </p>
      {status === 'connected' && (
        <>
          <p>
            Connected to address: <Text i>{address}</Text>
          </p>
          <p>
            Balance: <Text i>{info.balance} ETH</Text>
          </p>
          <p>
            Token Balance: <Text i>{info.tokenBalance} LT0</Text>
          </p>
          <p>
            ETH/LT0 Ratio: <Text i>{info.ratio} LT0</Text>
          </p>
          <form onSubmit={handleBuy}>
            <Grid.Container css={{ marginTop: '8px' }}>
              <Grid css={{ marginRight: '24px' }}>
                <Input
                  bordered
                  labelRight="LT0"
                  placeholder="Amount"
                  aria-label="Purchase token"
                  type="number"
                  value={info.buyTokens}
                  onChange={e => setInfo(prev => ({ ...prev, buyTokens: Number(e.target.value) }))}
                />
              </Grid>

              <Grid>
                <Button color="secondary" disabled={isBuying} auto type="submit">
                  {!isBuying ? 'Buy tokens' : <Loading type="spinner" color="currentColor" size="sm" />}
                </Button>
              </Grid>
              <Grid css={{ marginLeft: '16px' }}>
                <Button color="secondary" ghost disabled={isBurning} auto type="button" onClick={handleBurn}>
                  {' '}
                  {!isBurning ? 'Burn tokens' : <Loading type="spinner" color="currentColor" size="sm" />}
                </Button>
              </Grid>
            </Grid.Container>
          </form>
        </>
      )}
    </div>
  );
};

export default AccountInfo;
