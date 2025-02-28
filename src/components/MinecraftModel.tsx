
import React from 'react';

interface MinecraftModelProps {
  playerName: string;
  playerId?: string;
}

const MinecraftModel: React.FC<MinecraftModelProps> = ({ playerName, playerId }) => {
  // Use playerId if available, otherwise use playerName as a fallback
  const id = playerId || playerName;
  
  return (
    <div className="flex flex-col items-center my-4">
      <div 
        className="rounded-md overflow-hidden border-4 border-pokemon-border mb-2"
        style={{ width: '96px', height: '96px' }}
      >
        <img 
          src={`https://mc-heads.net/avatar/${id}`} 
          alt={`${playerName}'s head`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default MinecraftModel;
