
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
        <h1 className="font-press-start text-2xl text-center mb-8 relative overflow-hidden">
          <span 
            className="relative inline-block animate-shimmer before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#8E9196]/20 before:to-transparent"
            style={{ color: '#1A1F2C' }}
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
      <style>
        {`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          .animate-shimmer::before {
            animation: shimmer 2s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Index;
