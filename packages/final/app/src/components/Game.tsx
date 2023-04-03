import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

const Game = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const currUser = session?.user as any;
  const { data } = useQuery(['lobby'], () => axios.get('/game/lobby'));

  useEffect(() => {
    socket.on('receiveInvalidateQuery', (queryKeys: string[]) => {
      queryClient.invalidateQueries({ queryKey: queryKeys });
    });
  }, []);

  const isInLobby = data?.data && data?.data.findIndex((d: any) => d.player._id === currUser._id) > -1;

  const joinLobbyMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.post(`/game/lobby/${id}`);
    },
    onSuccess: () => socket.emit('sendInvalidateQuery', ['lobby']),
  });

  const leaveLobbyMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.delete(`/game/lobby/${id}`);
    },
    onSuccess: () => socket.emit('sendInvalidateQuery', ['lobby']),
  });

  return (
    <div className="p-8">
      <section className="flex">
        <div className="card card-compact  bg-base-300 shadow-xl">
          <div className="card-body space-y-2">
            <header className="prose">
              <h2 className="card-title">Game lobby</h2>
            </header>
            <ul>
              {data?.data.length > 0 ? (
                data?.data.map((p: any, idx: number) => (
                  <li key={p._id} className="font-medium space-x-4">
                    <span>{idx + 1}.</span>
                    <span>
                      <b>{p.player.name}</b> <i>({p.player.address})</i>
                    </span>
                    <span>
                      <div className="badge badge-accent">level: {p.player.level}</div>
                    </span>
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
    </div>
  );
};

export default Game;
