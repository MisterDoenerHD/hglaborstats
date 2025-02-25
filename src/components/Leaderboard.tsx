
import React, { useState } from 'react';
import { Trophy, ArrowUpDown } from 'lucide-react';
import type { Player, SortField } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from './ui/button';

interface LeaderboardProps {
  initialPlayers: Player[];
  onPlayerClick: (player: Player) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ initialPlayers, onPlayerClick }) => {
  const [sortField, setSortField] = useState<SortField>('kills');
  const [page, setPage] = useState(1);
  
  const { data: players = initialPlayers, isFetching } = useQuery({
    queryKey: ['players', sortField, page],
    queryFn: () => api.getTopPlayers(sortField, page),
    placeholderData: initialPlayers,
    keepPreviousData: true
  });

  const handleSort = (field: SortField) => {
    if (sortField !== field) {
      setSortField(field);
      setPage(1);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const TableContent = ({ position = 'top' }: { position?: 'top' | 'bottom' }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-pokemon-border">
            <th className="p-3 text-left font-press-start text-sm">#</th>
            <th className="p-3 text-left font-press-start text-sm">Player</th>
            {[
              { key: 'kills', label: 'Kills' },
              { key: 'deaths', label: 'Deaths' },
              { key: 'bounty', label: 'Bounty' },
              { key: 'currentKillStreak', label: 'Current Streak' },
              { key: 'highestKillStreak', label: 'Highest Streak' },
              { key: 'xp', label: 'XP' }
            ].map(({ key, label }) => (
              <th 
                key={key}
                onClick={() => handleSort(key as SortField)}
                className={`p-3 text-left font-press-start text-sm cursor-pointer transition-colors duration-200 hover:bg-pokemon-green/10 ${
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
        {position === 'bottom' && (
          <tbody>
            {players.map((player, index) => (
              <tr 
                key={`${player.playerId}-${index}`}
                className="border-b border-pokemon-border/50 hover:bg-pokemon-green/5 transition-colors duration-200 animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="p-3 font-press-start text-sm">{index + 1}</td>
                <td className="p-3 font-mono">
                  <button 
                    onClick={() => onPlayerClick(player)}
                    className="hover:text-pokemon-green transition-colors duration-200 hover:underline text-left w-full"
                  >
                    {player.name}
                  </button>
                </td>
                <td className="p-3 font-mono">{player.kills.toLocaleString()}</td>
                <td className="p-3 font-mono">{player.deaths.toLocaleString()}</td>
                <td className="p-3 font-mono">{player.bounty.toLocaleString()}</td>
                <td className="p-3 font-mono">{player.currentKillStreak.toLocaleString()}</td>
                <td className="p-3 font-mono">{player.highestKillStreak.toLocaleString()}</td>
                <td className="p-3 font-mono">{player.xp.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-in">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Trophy className="text-pokemon-green animate-slide-in" size={24} />
        <h2 className="font-press-start text-xl text-pokemon-dark animate-slide-in">Top Players</h2>
      </div>
      <div className="bg-pokemon-light border-2 border-pokemon-border rounded overflow-hidden animate-slide-in">
        <TableContent position="top" />
        <TableContent position="bottom" />
        <div className="p-4 flex justify-center">
          <Button 
            onClick={loadMore}
            disabled={isFetching}
            variant="outline"
            className="font-press-start text-sm transition-all duration-200 hover:scale-105"
          >
            {isFetching ? 'Loading...' : `Load More (${players.length} players)`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
