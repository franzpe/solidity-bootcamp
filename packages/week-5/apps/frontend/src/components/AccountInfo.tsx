import { Text } from '@nextui-org/react';
import { BigNumber, Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useMetamaskContext } from '../hooks/MetamaskContext';

type Props = {
  tokenContract: Contract | undefined;
};

const AccountInfo = ({ tokenContract }: Props) => {
  const { address, provider, status } = useMetamaskContext();
  const [info, setInfo] = useState({ balance: 0, tokenBalance: 0 });

  useEffect(() => {
    if (address && provider) {
      provider!.getBalance(address).then((balanceBn: BigNumber) => {
        setInfo(prev => ({ ...prev, balance: Number(ethers.utils.formatEther(balanceBn)) }));
      });
    }
  }, [address, provider]);

  useEffect(() => {
    if (address && tokenContract) {
      tokenContract.balanceOf(address).then((balanceBn: BigNumber) => {
        setInfo(prev => ({ ...prev, tokenBalance: Number(ethers.utils.formatEther(balanceBn)) }));
      });
    }
  }, [address, tokenContract]);

  return (
    <>
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
        </>
      )}
    </>
  );
};

export default AccountInfo;
