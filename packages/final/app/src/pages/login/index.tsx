import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';

const Login = () => {
  const router = useRouter();
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();
  const [registerForm, setRegisterForm] = useState({ shouldRegister: false, isRegistering: false, name: '' });

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

      const { data: isRegistred } = await axios.get(`/players/check/${address}`);

      if (isRegistred) {
        router.push(callbackUrl);
      } else {
        setRegisterForm({ ...registerForm, shouldRegister: true });
      }
    } catch (error) {
      window.alert(error);
    }
  };

  useEffect(() => {
    if (isConnected && !session) {
      handleLogin();
    }
  }, [isConnected]);

  const handleSubmitRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setRegisterForm({ ...registerForm, isRegistering: true });

      await axios.post('/players/register', {
        address,
        name: registerForm.name,
        imgUri: '',
      });

      router.push('/');
    } catch (err) {
      window.alert(err);
    }
  };

  return (
    <div className="flex w-full h-full items-center justify-center">
      {!isConnected && <ConnectButton label="Sign In"></ConnectButton>}
      {isConnected && registerForm.shouldRegister && (
        <form onSubmit={handleSubmitRegister}>
          <label htmlFor="name">Nickname</label>
          <input
            id="name"
            type="text"
            onChange={e => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
          />
          <button>Register</button>
        </form>
      )}
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
