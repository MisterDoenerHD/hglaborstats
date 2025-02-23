
import React from 'react';
import type { Player } from '../services/api';

interface PlayerStatsProps {
  player: Player;
}

interface ExperiencePoints {
  experiencePoints: number;
}

interface HeroAbilities {
  [key: string]: ExperiencePoints;
}

interface HeroSkills {
  [key: string]: HeroAbilities;
}

const calculateHeroLevel = (xp: number): number => {
  return Math.floor(xp / 1000) + 1;
};

const calculateHeroXP = (heroSkills: HeroSkills): { xp: number; level: number } => {
  const totalXP = Object.values(heroSkills).reduce((skillTotal: number, abilities: HeroAbilities) => {
    return skillTotal + Object.values(abilities).reduce((abilityTotal: number, ability: ExperiencePoints) => {
      return abilityTotal + ability.experiencePoints;
    }, 0);
  }, 0);

  const level = calculateHeroLevel(totalXP);
  return { xp: totalXP, level };
};

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-in">
      <h2 className="font-press-start text-xl text-pokemon-dark mb-6 text-center">{player.name}</h2>
      <div className="bg-pokemon-light border-2 border-pokemon-border rounded p-6">
        <div className="grid gap-4">
          {Object.entries(player.heroes).map(([hero, skills]) => {
            const { xp, level } = calculateHeroXP(skills as HeroSkills);
            const nextLevelXP = level * 1000;
            const progress = (xp % 1000) / 1000 * 100;
            
            return (
              <div key={hero} className="border-2 border-pokemon-border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-pokemon-dark capitalize">{hero}</span>
                  <span className="font-press-start text-sm text-pokemon-green">Lv.{level}</span>
                </div>
                <div className="w-full bg-pokemon-gray/20 rounded h-4 overflow-hidden">
                  <div
                    className="h-full bg-pokemon-green transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
