import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

const Game = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const currUser = session?.user as any;
  const { data } = useQuery(['lobby'], () => axios.get('/game/lobby'));
  const [challenger, setChallenger] = useState<{ name: string; level: number; _id: number } | undefined>();

  useEffect(() => {
    socket.on('receiveInvalidateQuery', (queryKeys: string[]) => {
      queryClient.invalidateQueries({ queryKey: queryKeys });
    });
  }, []);

  const isInLobby = useMemo(
    () => data?.data && data?.data.findIndex((d: any) => d.player._id === currUser._id) > -1,
    [data?.data],
  );

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

    return () => {
      socket.off('receiveChallenge');
      setChallenger(undefined);
    };
  }, [isInLobby]);

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

  const handleChallenge = (idx: number) => (e: any) => {
    socket.emit('challenge', {
      challengedBy: { _id: currUser._id, name: currUser.name, level: currUser.level },
      challengeTo: data?.data[idx].player._id,
    });

    window.alert(`You have challenged player ${data?.data[idx].player.name}`);
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
                    <span>{idx + 1}.</span>
                    <span>
                      <b>{p.player.name}</b> <i>({p.player.address})</i>
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
                        <span>CHALLENGE</span>
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
              <button
                className="btn btn-sm btn-outline btn-success"
                onClick={() => joinLobbyMutation.mutate(currUser._id)}
              >
                Join lobby
              </button>
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
                <button className="btn btn-sm btn-success">ACCEPT</button>
                <button className="btn btn-sm btn-error">REJECT</button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Game;
