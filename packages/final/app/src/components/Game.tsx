import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const Game = () => {
  const { data: session } = useSession();
  const currUser = session?.user as any;
  const { data, status, refetch } = useQuery(['whatever'], () => axios.get('/game/lobby'));

  const isInLobby = data?.data.findIndex((d: any) => d.player._id === currUser._id) > -1;

  const joinLobbyMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.post(`/game/lobby/${id}`);
    },
    onSuccess: () => refetch(),
  });

  const leaveLobbyMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.delete(`/game/lobby/${id}`);
    },
    onSuccess: () => refetch(),
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
