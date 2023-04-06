import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import cx from 'classnames';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';

type Props = {
  id: number;
  count: number;
};

const Item = ({ id, count }: Props) => {
  const { data, isSuccess } = useQuery(['lobby', id], () =>
    axios.get(`https://ipfs.io/ipfs/bafybeibtavm74qrswfrdzbvsftdofdsfwulycnmyp5q62jso7twt73o6ju/${id}.json`),
  );

  if (!isSuccess) return null;

  return (
    <div className="card card-compact bg-base-300 shadow shadow-orange-400">
      <div className="card-body flex flex-col">
        <div className="flex flex-row items-center space-x-4">
          <div className="indicator">
            <img
              src={data!.data.image}
              alt="reward"
              width="40"
              height="40"
              className="rounded-lg border border-gray-700"
            />
            {count > 1 && (
              <span className="indicator-item badge badge-warning badge-sm">
                <b>{count}</b>
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span>
              <b className="text-lg">{data!.data.name}</b>
              <span className="badge badge-info ml-2">level: {data!.data.level}</span>
            </span>
            <span>
              Slot: <b>{data.data.slot}</b>
            </span>
          </div>
        </div>
        <div>
          <span className="italic">"{data.data.description}"</span>
          <div className="italic space-x-4">
            {data.data.slot === 'weapon' ? (
              <span>Damage: {data.data.damage}</span>
            ) : (
              <span>Armor: {data.data.armor}</span>
            )}
            <span>Strength: {data.data.strength}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const socket = io('http://localhost:3001');

const Game = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const currUser = session?.user as any;
  const { data } = useQuery(['lobby'], () => axios.get('/game/lobby'));
  const { data: rankings } = useQuery(['rankings'], () => axios.get('/game/rankings'));
  const [challenger, setChallenger] = useState<{ name: string; level: number; _id: number } | undefined>();
  const [challengingIdx, setChallengingIdx] = useState<number | undefined>();

  const { data: itemsIds } = useQuery(['Items'], async () => {
    const { data: items } = await axios.get(`/players/${currUser?._id}/items`);

    const idsWithCount: { id: number; count: number }[] = [];

    items.forEach((item: any) => {
      const idx = idsWithCount.findIndex(i => i.id === item.ipfsId);

      if (idx > -1) {
        idsWithCount[idx] = { ...idsWithCount[idx], count: idsWithCount[idx].count + 1 };
      } else {
        idsWithCount.push({ id: item.ipfsId, count: 1 });
      }
    });

    console.log(idsWithCount);

    return idsWithCount;
    // return Array.from(new Set(items.map((i: any) => i.ipfsId)));
  });

  const joinLobbyMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.post(`/game/lobby/${id}`);
    },
    onSuccess: () => {
      socket.emit('sendInvalidateQuery', ['lobby']);
    },
  });

  const leaveLobbyMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.delete(`/game/lobby/${id}`);
    },
    onSuccess: () => {
      socket.emit('sendInvalidateQuery', ['lobby']);
    },
  });

  const responseChallenge = useMutation({
    mutationFn: (response: boolean) => {
      return axios.post(`/game/challenge-response`, {
        challengedById: challenger?._id,
        challengedTo: currUser._id,
        response,
      });
    },
    onSuccess: ({ data }) => {
      if (data !== '') {
        console.log('BATTLE CAN BEGIN', data);
        startBattle(data);
      } else {
        setChallenger(undefined);
      }
    },
  });

  useEffect(() => {
    socket.on('receiveInvalidateQuery', (queryKeys: string[]) => {
      queryClient.invalidateQueries({ queryKey: queryKeys });
    });
  }, []);

  const isInLobby = useMemo(
    () => data?.data && data?.data.findIndex((d: any) => d.player._id === currUser._id) > -1,
    [data?.data],
  );

  const startBattle = (battleId: string) => {
    router.push('/' + battleId);
    //TODO
  };

  useEffect(() => {
    socket.on('receiveChallenge', payload => {
      if (payload.challengeTo === currUser._id) {
        setChallenger({
          _id: payload.challengedBy._id,
          name: payload.challengedBy.name,
          level: payload.challengedBy.level,
        });
      }
    });

    socket.on('challengeResponse', payload => {
      console.log(payload);
      if (payload.challengedById === currUser._id) {
        if (!payload.response) {
          // Player rejected challenge "Pussy"
          setChallengingIdx(undefined);
        } else {
          console.log('BATTLE CAN BEGIN', payload.battleId);
          startBattle(payload.battleId);
        }
      }
    });

    return () => {
      socket.off('receiveChallenge');
      setChallenger(undefined);
    };
  }, [isInLobby]);

  const handleChallenge = (idx: number) => (e: any) => {
    socket.emit('challenge', {
      challengedBy: { _id: currUser._id, name: currUser.name, level: currUser.level },
      challengeTo: data?.data[idx].player._id,
    });

    setChallengingIdx(idx);
  };

  const handleChallengeResponse = (response: boolean) => (e: any) => {
    responseChallenge.mutate(response);
  };

  return (
    <div className="p-8 flex items-start justify-start space-x-4">
      <section className="inline-flex">
        <div className="card card-compact  bg-base-300 shadow-xl">
          <div className="card-body space-y-2">
            <header className="prose">
              <h2 className="card-title">Game lobby</h2>
            </header>
            <ul className="space-y-2">
              {data?.data.length > 0 ? (
                data?.data.map((p: any, idx: number) => (
                  <li key={p._id} className="font-medium space-x-4 flex items-center">
                    <span className="w-2">{idx + 1}.</span>
                    <span className="flex items-center">
                      {currUser?._id === p.player._id && <span className="badge badge-success badge-xs mr-2" />}
                      <b className="font-bold text-green-300 mr-2">{p.player.name}</b>{' '}
                      <i>({[p.player.address.slice(0, 8), '....', p.player.address.slice(-4)].join('')})</i>
                    </span>
                    <span>
                      <div className="badge badge-accent">level: {p.player.level}</div>
                    </span>
                    {isInLobby && p.player.address !== currUser.address && (
                      <button
                        className="btn btn-xs btn-secondary inline-flex space-x-2"
                        onClick={handleChallenge(idx)}
                      >
                        <Image
                          src="/attack-2.jpeg"
                          width={22}
                          height={22}
                          alt="challenge"
                          className="filter invert"
                        />
                        <span>{challengingIdx !== idx ? 'CHALLENGE' : 'WAITING FOR RESPONSE'}</span>
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <li>
                  <h3>Waiting for players to join the lobby.</h3>
                </li>
              )}
            </ul>
            <div className="mt-8 card-actions">
              {!isInLobby && (
                <button
                  className="btn btn-sm btn-outline btn-success"
                  onClick={() => joinLobbyMutation.mutate(currUser._id)}
                >
                  Join lobby
                </button>
              )}
              {isInLobby && (
                <button
                  className="btn btn-sm btn-outline btn-error"
                  onClick={() => leaveLobbyMutation.mutate(currUser._id)}
                >
                  Leave lobby
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      {challenger && (
        <section className="inline-flex">
          <div className="card card-compact bg-base-300 shadow-xl">
            <figure className="pt-4 flex flex-col">
              <Image src="/attack-2.jpeg" width={64} height={64} alt="challenge" className="filter invert" />
              <div className="badge badge-accent mt-4">level: {challenger?.level}</div>
              <p className="text-center text-2xl mt-4 prose">{challenger?.name}</p>
            </figure>
            <div className="card-body space-y-2">
              <div className="card-actions flex justify-between space-x-4">
                <button className="btn btn-sm btn-success" onClick={handleChallengeResponse(true)}>
                  ACCEPT
                </button>
                <button className="btn btn-sm btn-error" onClick={handleChallengeResponse(false)}>
                  REJECT
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="card card-compact  bg-base-300 shadow-xl">
          <div className="card-body space-y-2">
            <header className="prose">
              <h2 className="card-title">
                Rankings <Image src="/rank.png" width={24} height={24} alt="rank" className="m-0" />
              </h2>
            </header>
            <ul className="space-y-2">
              {rankings?.data.map((p: any, idx: number) => (
                <li
                  key={p.player._id}
                  className={cx('font-medium space-x-4 flex items-center', {
                    ['text-amber-500']: idx === 0,
                  })}
                >
                  <span className="w-2">{idx + 1}.</span>
                  <span>
                    <b>{p.player.name}</b>{' '}
                    <i>({[p.player.address.slice(0, 8), '....', p.player.address.slice(-4)].join('')})</i>
                  </span>
                  <div className="badge badge-outline">
                    {p.wins} win{p.wins > 1 ? 's' : ''}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="card card-compact  bg-base-300 shadow-xl">
          <div className="card-body space-y-2">
            <header className="prose">
              <h2 className="card-title">
                Inventory <span className="text-sm italic">(NFT'S)</span>
              </h2>
            </header>
            {itemsIds && itemsIds.length > 0 ? (
              <div className="space-y-4">
                {itemsIds?.map(i => (
                  <Item key={i.id} id={i.id} count={i.count} />
                ))}
              </div>
            ) : (
              <div>You have no items yet. Fight for your live and get some! </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Game;
