
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../components/SearchBar';
import Leaderboard from '../components/Leaderboard';
import PlayerStats from '../components/PlayerStats';
import { api, Player } from '../services/api';
import { toast } from 'sonner';

const Index = () => {
  const [searchedPlayer, setSearchedPlayer] = useState<Player | null>(null);

  const { data: initialPlayers = [] } = useQuery({
    queryKey: ['players', 'kills', 1],
    queryFn: () => api.getTopPlayers('kills', 1),
  });

  const handleSearch = async (query: string) => {
    try {
      const player = await api.searchPlayer(query);
      if (player) {
        setSearchedPlayer(player);
      } else {
        toast.error("Player not found!");
      }
    } catch (error) {
      toast.error("Failed to search for player");
    }
  };

  const handlePlayerClick = (player: Player) => {
    setSearchedPlayer(player);
  };

  const handleBack = () => {
    setSearchedPlayer(null);
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#FDE1D3' }}>
      <div 
        className="max-w-4xl mx-auto p-6 rounded-lg"
        style={{
          backgroundColor: '#F2FCE2',
          border: '4px solid #403E43',
          boxShadow: '8px 8px 0 #1A1F2C'
        }}
      >
        <h1 className="font-press-start text-4xl text-center mb-12 relative">
          <span 
            className="relative inline-block text-pokemon-dark"
            style={{ 
              textShadow: '0 0 10px rgba(157, 191, 158, 0.7), 0 0 20px rgba(157, 191, 158, 0.5)' 
            }}
          >
            HGLabor Stats
          </span>
        </h1>
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div 
          className="rounded-lg p-4"
          style={{
            backgroundColor: '#FFDEE2',
            border: '2px solid #403E43'
          }}
        >
          {searchedPlayer ? (
            <PlayerStats player={searchedPlayer} onBack={handleBack} />
          ) : (
            <Leaderboard initialPlayers={initialPlayers} onPlayerClick={handlePlayerClick} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
