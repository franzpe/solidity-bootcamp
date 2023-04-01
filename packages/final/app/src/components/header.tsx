import { ConnectButton } from '@rainbow-me/rainbowkit';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Header() {
  const account = useAccount();

  useEffect(() => {
    if (account.isDisconnected) {
      signOut();
    }
  }, [account.isDisconnected]);

  return (
    <header>
      <ConnectButton />
    </header>
  );
}
