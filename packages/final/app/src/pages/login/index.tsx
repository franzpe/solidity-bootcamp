import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';

const Login = () => {
  const router = useRouter();
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();

  const handleLogin = async () => {
    try {
      const callbackUrl = (router.query?.callbackUrl as string) ?? '/';
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      await signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      });

      router.push(callbackUrl);
    } catch (error) {
      window.alert(error);
    }
  };

  useEffect(() => {
    if (isConnected && !session) {
      handleLogin();
    }
  }, [isConnected]);

  return (
    <div className="flex w-full h-full items-center justify-center">
      {!isConnected && <ConnectButton label="Sign In"></ConnectButton>}
    </div>
  );
};

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default Login;
