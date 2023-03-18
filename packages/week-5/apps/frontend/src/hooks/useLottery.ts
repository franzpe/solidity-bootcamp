import { Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import lotteryJson from '../asssets/contracts/Lottery.json';
import lotteryTokenJson from '../asssets/contracts/LotteryToken.json';
import { useMetamaskContext } from './MetamaskContext';

type Options = {};

const useLottery = (options?: Options) => {
  const { provider } = useMetamaskContext();
  const [lotteryContract, setLotteryContract] = useState<Contract | undefined>(undefined);
  const [tokenContract, setTokenContract] = useState<Contract | undefined>(undefined);

  useEffect(() => {
    if (provider) {
      const lotteryContract = new ethers.Contract(
        process.env.REACT_APP_LOTTERY_ADDRESS || '',
        lotteryJson.abi,
        provider
      );

      lotteryContract.paymentToken().then((tokenAddress: string) => {
        console.log(tokenAddress);
        const tokenContract = new ethers.Contract(tokenAddress, lotteryTokenJson.abi, provider);
        setTokenContract(tokenContract);
      });

      setLotteryContract(lotteryContract);
    }
  }, [provider]);

  return { lotteryContract, tokenContract } as const;
};

export default useLottery;
