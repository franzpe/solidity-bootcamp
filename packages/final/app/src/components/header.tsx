import gameTokens from '@/abis/gameTokensAbi.json';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import Image from 'next/image';
import Link from 'next/link';
import { useAccount, useContractRead } from 'wagmi';

export default function Header() {
  const account = useAccount();

  const { data } = useContractRead({
    address: process.env.NEXT_PUBLIC_GAME_TOKENS_CONTRACT_ADDRESS as any,
    abi: gameTokens,
    functionName: 'balanceOf',
    args: [account.address, '0'],
  });

  return (
    <header className="flex justify-between p-6 shadow-md">
      <div className="prose">
        <h2 className="text-3xl">
          <Link href="/" className="no-underline">
            Rogue <span className="text-gray-50">Mansion</span>
          </Link>
        </h2>
      </div>
      <div className="flex items-center">
        <div className="mr-6 transition hover:scale-110">
          <Image src="/gold.png" width={24} height={24} alt="gold" className="max-h-6 inline-block mr-2" />
          <span className="font-bold">{ethers.utils.formatUnits((data as any) || '0', 'wei')}</span>
        </div>
        <div className="mr-6 relative transition hover:scale-110">
          <Image
            src="/avatar2.jpeg"
            width={30}
            height={30}
            alt="gold"
            className="w-10 h-10 rounded-lg inline-block mr-2 border border-gray-800 "
          />
          <span className="absolute bottom-0 left-8 transform translate-y-1/4 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
}
