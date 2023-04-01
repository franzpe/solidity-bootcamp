import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const Login = () => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <ConnectButton label="Login with wallet" />
    </div>
  );
};

export default Login;
