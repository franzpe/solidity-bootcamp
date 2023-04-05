import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
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
    <div className="flex w-full h-full items-center justify-center flex-col relative overflow-hidden">
      <div className="flex flex-col items-start">
        <header className="prose mb-8">
          <h1 className="text-8xl">
            Rogue <span className="text-gray-50">Mansion</span>
          </h1>
        </header>
        <Image
          className="absolute bottom-0 -right-52"
          src="/rogue.png"
          alt="Rogue image"
          width={980}
          height={800}
        />
        <main>
          <blockquote className="text-xl italic font-semibold text-gray-900 dark:text-white mb-4">
            <p>"There needs to be an honor among thiefs!"</p>
          </blockquote>
          {!isConnected && <ConnectButton label="Play the Game"></ConnectButton>}
          {isConnected && registerForm.shouldRegister && (
            <form className="flex flex-row items-end space-x-4" onSubmit={handleSubmitRegister}>
              <div className="flex flex-col items-start space-y-4">
                <label htmlFor="name">What's your deadly name?</label>
                <input
                  id="name"
                  type="text"
                  className="input input-bordered"
                  onChange={e => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <button className="btn">Register</button>
            </form>
          )}
        </main>
      </div>
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
