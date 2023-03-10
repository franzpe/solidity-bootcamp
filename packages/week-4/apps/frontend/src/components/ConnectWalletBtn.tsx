import { HTMLAttributes } from 'react';

export type WalletConnectionStatus = 'connected' | 'connecting' | 'disconnected';

type ConnectWalletBtnProps = {
  status: WalletConnectionStatus;
} & HTMLAttributes<HTMLButtonElement>;

const statusTextMap: Record<WalletConnectionStatus, string> = {
  connected: 'Disconnect',
  connecting: 'Connecting...',
  disconnected: 'Connect Wallet',
};

const ConnectWalletBtn = ({ status, onClick, ...restProps }: ConnectWalletBtnProps) => {
  return (
    <button onClick={onClick} {...restProps}>
      {statusTextMap[status]}
    </button>
  );
};

export default ConnectWalletBtn;
