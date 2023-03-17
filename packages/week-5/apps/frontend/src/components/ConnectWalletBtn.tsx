import { Button } from '@nextui-org/react';
import { HTMLAttributes } from 'react';

export type WalletConnectionStatus = 'connected' | 'connecting' | 'disconnected';

type ConnectWalletBtnProps = {
  status: WalletConnectionStatus;
} & Omit<HTMLAttributes<Element>, 'color'>;

const statusTextMap: Record<WalletConnectionStatus, string> = {
  connected: 'Disconnect',
  connecting: 'Connecting...',
  disconnected: 'Connect Wallet'
};

const ConnectWalletBtn = ({ status, onClick, ...restProps }: ConnectWalletBtnProps) => {
  return (
    <Button shadow color="gradient" onClick={onClick} size="md" {...restProps}>
      {statusTextMap[status]}
    </Button>
  );
};

export default ConnectWalletBtn;
