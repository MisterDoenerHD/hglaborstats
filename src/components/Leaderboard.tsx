
import React from 'react';
import { Trophy } from 'lucide-react';
import type { Player } from '../services/api';

interface LeaderboardProps {
  players: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Trophy className="text-pokemon-green" size={24} />
        <h2 className="font-press-start text-xl text-pokemon-dark">Top Players</h2>
      </div>
      <div className="bg-pokemon-light border-2 border-pokemon-border rounded p-4">
        {players.map((player, index) => (
          <div
            key={player.uuid}
            className="flex items-center p-3 mb-2 hover:bg-pokemon-green/10 transition-colors rounded"
          >
            <span className="font-press-start text-sm text-pokemon-dark w-8">{index + 1}.</span>
            <span className="font-mono text-pokemon-dark flex-1">{player.name}</span>
            <span className="font-mono text-pokemon-gray">
              Total Level: {Object.values(player.heroes).reduce((acc, hero) => acc + hero.level, 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
