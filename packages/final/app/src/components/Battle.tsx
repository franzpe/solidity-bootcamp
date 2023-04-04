import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import cx from 'classnames';
import Image from 'next/image';
import axios from 'axios';
import { useEffect, useId, useState } from 'react';
import { socket } from './Game';
import { useSession } from 'next-auth/react';
import HealthBar from './HealthBar';

type Props = { id: string | string[] };

type TurnInfo = {
  battleId: string;
  fromName: string;
  from: string;
  to: string;
  toName: string;
  damage: number;
  spell: string;
  isCritical: boolean;
};

const TOTAL_HP = 50;

const Battle = ({ id }: Props) => {
  const [turnId, setTurnId] = useState<string | undefined>();
  const [turns, setTurns] = useState<TurnInfo[]>([]);
  const [hp, setHp] = useState<Record<string, { hp: number; dmg: number }>>();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const currUser = session?.user as any;

  const endBattle = useMutation((winner: string) => axios.post('/game/battle/' + id, { winner }), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['battle'] });
    },
  });

  const { data, isLoading } = useQuery(['battle'], () => axios.get('/game/battle/' + id), {
    onSuccess: ({ data }) => {
      // INIT
      if (!turnId) {
        setTurnId(data.player1._id);
        setHp({ [data.player1._id]: { hp: TOTAL_HP, dmg: 0 }, [data.player2._id]: { hp: TOTAL_HP, dmg: 0 } });
      }

      socket.on('receiveHit', (hitPayload: TurnInfo) => {
        if (data._id === hitPayload.battleId) {
          setTurns(prev => [...prev, hitPayload]);
          setHp(prev => {
            const hpLeft = (prev?.[hitPayload.to]?.hp || 0) - hitPayload.damage;

            if (hpLeft < 0) {
              // WON ENDGAME
              endBattle.mutate(hitPayload.from);
            }
            return {
              ...prev,
              [hitPayload.to]: {
                dmg: hitPayload.damage,
                hp: hpLeft <= 0 ? 0 : hpLeft,
              },
            };
          });

          // Who is next
          setTurnId(hitPayload.to);
        }
      });
    },
    staleTime: Infinity,
  });

  const { data: spellsData } = useQuery(['spells'], () => axios.get('/spells'), { staleTime: Infinity });

  const handleAttack = (pNum: number, spellIdx: number) => (e: any) => {
    const playerFrom = pNum === 1 ? data?.data.player1 : data?.data.player2;
    const playerTo = pNum === 1 ? data?.data.player2 : data?.data.player1;
    const spell = spellsData?.data[spellIdx];

    const critChance = 0.3;
    const rand = Math.random();
    const dmg = spell.baseDamage * (rand + spell.baseDamage) * (rand < critChance ? 2.56 : 1);

    socket.emit('attack', {
      battleId: id,
      from: playerFrom._id,
      fromName: playerFrom.name,
      to: playerTo._id,
      toName: playerTo.name,
      spell: spell.name,
      damage: Math.round(dmg * 100) / 100,
      isCritical: rand < critChance,
    });
  };

  const isFinished = data?.data.status === 'finished';
  const isWinner = currUser._id === data?.data.winner?._id;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      {isFinished && (
        <div className="prose">
          <h1>
            You've{' '}
            {currUser?._id === data?.data?.winner._id ? (
              <span className="text-success">won!</span>
            ) : (
              <span className="text-error">lost!</span>
            )}
          </h1>
        </div>
      )}
      <div className="flex space-x-8">
        <div>
          <div
            className={cx('card card-compact bg-base-300', {
              ['shadow-inner shadow-yellow-400 border border-yellow-400']:
                turnId === data?.data.player1._id && !isFinished,
            })}
          >
            <figure className="p-4 pb-0 flex flex-col">
              <Image src="/avatar.jpeg" width={128} height={128} alt="challenge" className="rounded-lg" />
              <div className="badge badge-accent mt-4">level: {data?.data.player1.level}</div>
              <p className="text-center text-2xl my-2 prose">{data?.data.player1.name}</p>
            </figure>
          </div>
          <div className="mt-2 px-2">
            <HealthBar
              hpTotal={TOTAL_HP}
              hpLeft={hp?.[data?.data.player1._id].hp || 0}
              damage={hp?.[data?.data.player1._id].dmg || 0}
            />
          </div>
          <div className="space-x-1 mt-2 text-center">
            {spellsData?.data &&
              spellsData.data.map((s: any, idx: number) => (
                <button
                  key={s._id}
                  className="rounded-lg border border-gray-800 hover:border-gray-200 tooltip tooltip-warning tooltip-bottom whitespace-pre"
                  data-tip={`Name: ${s.name}\nRequired level: ${s.requiredLevel}\nDamage: ${s.baseDamage}`}
                  disabled={
                    currUser?._id !== data?.data.player1._id || turnId !== data?.data.player1._id || isFinished
                  }
                  onClick={handleAttack(1, idx)}
                >
                  <img
                    src={s.imageUri}
                    alt="attack"
                    className={cx('rounded-lg', {
                      ['filter grayscale']: currUser?._id !== data?.data.player1._id || isFinished,
                    })}
                  />
                </button>
              ))}
          </div>
        </div>

        <div>
          <div
            className={cx('card card-compact bg-base-300', {
              ['shadow-inner shadow-yellow-400 border border-yellow-400']:
                turnId === data?.data.player2._id && !isFinished,
            })}
          >
            <figure className="p-4 pb-0 flex flex-col">
              <Image src="/avatar2.jpeg" width={128} height={128} alt="challenge" className="rounded-lg" />
              <div className="badge badge-accent mt-4">level: {data?.data.player2.level}</div>
              <p className="text-center text-2xl my-2 prose">{data?.data.player2.name}</p>
            </figure>
          </div>
          <div className="mt-2 px-2">
            <HealthBar
              hpTotal={TOTAL_HP}
              hpLeft={hp?.[data?.data.player2._id].hp || 0}
              damage={hp?.[data?.data.player2._id].dmg || 0}
            />
          </div>
          <div className="space-x-1 mt-2 text-center">
            {spellsData?.data &&
              spellsData.data.map((s: any, idx: number) => (
                <button
                  key={s._id}
                  className="rounded-lg border border-gray-800 hover:border-gray-200 tooltip tooltip-warning tooltip-bottom whitespace-pre"
                  data-tip={`Name: ${s.name}\nRequired level: ${s.requiredLevel}\nDamage: ${s.baseDamage}`}
                  disabled={
                    currUser?._id !== data?.data.player2._id || turnId !== data?.data.player2._id || isFinished
                  }
                  onClick={handleAttack(2, idx)}
                >
                  <img
                    src={s.imageUri}
                    alt="attack"
                    className={cx('rounded-lg', {
                      ['filter grayscale']: currUser?._id !== data?.data.player2._id || isFinished,
                    })}
                  />
                </button>
              ))}
          </div>
        </div>
      </div>
      <div
        className="flex flex-col bg-base-300 shadow-xl h-56 rounded-lg overflow-auto"
        style={{ width: '680px' }}
      >
        <div className="card card-compact ">
          <div className="card-body ">
            <ul className="">
              {turns.map((t, idx) => (
                <li key={idx} className={cx({ ['text-red-400']: currUser?._id === t.to })}>
                  [<b>{t.fromName}</b>]: Inflicts{' '}
                  <b>
                    {t.damage} {t.isCritical ? '(CRITICAL) ' : ''}
                  </b>
                  damage to
                  {t.toName} with spell {t.spell}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {isWinner && (
        <div className="text-center">
          <button className="btn btn-xl">Collect reward and exit</button>
        </div>
      )}
    </div>
  );
};

export default Battle;
