
import React from 'react';

interface MinecraftModelProps {
  playerName: string;
}

const MinecraftModel: React.FC<MinecraftModelProps> = ({ playerName }) => {
  return (
    <div className="w-[100px] h-[100px] mx-auto mb-6 animate-slide-in">
      <img 
        src={`https://minecraft-api.vercel.app/api/skins/${playerName}/head/front`}
        alt={`${playerName}'s face`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default MinecraftModel;
