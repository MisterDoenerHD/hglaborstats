
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
    <div 
      className="min-h-screen px-4 py-8 bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: 'url("https://i.imgur.com/WDaYH1S.jpeg")',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="font-press-start text-2xl text-center text-pokemon-dark mb-8 relative overflow-hidden">
          <span className="relative inline-block animate-shimmer before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
            HGLabor Stats
          </span>
        </h1>
        <SearchBar onSearch={handleSearch} />
        {searchedPlayer ? (
          <PlayerStats player={searchedPlayer} onBack={handleBack} />
        ) : (
          <Leaderboard initialPlayers={initialPlayers} onPlayerClick={handlePlayerClick} />
        )}
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
