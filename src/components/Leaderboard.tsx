
import React from 'react';
import { Trophy, ArrowUpDown } from 'lucide-react';
import type { Player, SortField } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface LeaderboardProps {
  initialPlayers: Player[];
  onPlayerClick: (player: Player) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ initialPlayers, onPlayerClick }) => {
  const [sortField, setSortField] = React.useState<SortField>('kills');
  
  const { data: players = initialPlayers } = useQuery({
    queryKey: ['players', sortField],
    queryFn: () => api.getTopPlayers(sortField, 1),
    placeholderData: initialPlayers
  });

  const handleSort = (field: SortField) => {
    if (sortField !== field) {
      setSortField(field);
    }
  };

  const headers = [
    { key: 'kills', label: 'Kills' },
    { key: 'deaths', label: 'Deaths' },
    { key: 'bounty', label: 'Bounty' },
    { key: 'currentKillStreak', label: 'Current Streak' },
    { key: 'highestKillStreak', label: 'Highest Streak' },
    { key: 'xp', label: 'XP' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-in">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Trophy className="text-pokemon-green animate-slide-in" size={24} />
        <h2 className="font-press-start text-xl text-pokemon-dark animate-slide-in">Top Players</h2>
      </div>
      <div className="bg-pokemon-light border-2 border-pokemon-border rounded overflow-hidden animate-slide-in">
        {/* Top Scrollbar */}
        <div className="overflow-x-auto border-b border-pokemon-border">
          <div className="w-fit">
            <div className="flex">
              <div className="w-16"></div> {/* Placeholder for # column */}
              <div className="w-48"></div> {/* Placeholder for Player column */}
              {headers.map(() => (
                <div key={`scroll-${Math.random()}`} className="w-36"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-pokemon-border">
                <th className="p-3 text-left font-press-start text-sm w-16">#</th>
                <th className="p-3 text-left font-press-start text-sm w-48">Player</th>
                {headers.map(({ key, label }) => (
                  <th 
                    key={key}
                    onClick={() => handleSort(key as SortField)}
                    className={`p-3 text-left font-press-start text-sm cursor-pointer transition-colors duration-200 hover:bg-pokemon-green/10 w-36 ${
                      sortField === key ? 'text-pokemon-green' : 'text-pokemon-dark'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr 
                  key={`${player.playerId}-${index}`}
                  className="border-b border-pokemon-border/50 hover:bg-pokemon-green/5 transition-colors duration-200 animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-3 font-press-start text-sm w-16">{index + 1}</td>
                  <td className="p-3 font-mono w-48">
                    <button 
                      onClick={() => onPlayerClick(player)}
                      className="hover:text-pokemon-green transition-colors duration-200 hover:underline text-left w-full"
                    >
                      {player.name}
                    </button>
                  </td>
                  <td className="p-3 font-mono w-36">{player.kills.toLocaleString()}</td>
                  <td className="p-3 font-mono w-36">{player.deaths.toLocaleString()}</td>
                  <td className="p-3 font-mono w-36">{player.bounty.toLocaleString()}</td>
                  <td className="p-3 font-mono w-36">{player.currentKillStreak.toLocaleString()}</td>
                  <td className="p-3 font-mono w-36">{player.highestKillStreak.toLocaleString()}</td>
                  <td className="p-3 font-mono w-36">{player.xp.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
