
import React from 'react';
import type { Player } from '../services/api';
import { Swords, Skull, Trophy, Star, Flame, Coins } from 'lucide-react';

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
  // Calculate K/D ratio
  const kdRatio = player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills;

  const stats = [
    { icon: Swords, label: 'Kills', value: player.kills.toLocaleString() },
    { icon: Skull, label: 'Deaths', value: player.deaths.toLocaleString() },
    { icon: Star, label: 'K/D Ratio', value: kdRatio },
    { icon: Flame, label: 'Current Streak', value: player.currentKillStreak.toLocaleString() },
    { icon: Trophy, label: 'Highest Streak', value: player.highestKillStreak.toLocaleString() },
    { icon: Coins, label: 'Bounty', value: player.bounty.toLocaleString() }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-in">
      <h2 className="font-press-start text-xl text-pokemon-dark mb-6 text-center">{player.name}</h2>
      
      {/* General Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-pokemon-light border-2 border-pokemon-border rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="text-pokemon-green" size={20} />
              <span className="font-press-start text-xs text-pokemon-dark">{label}</span>
            </div>
            <span className="font-mono text-lg text-pokemon-dark">{value}</span>
          </div>
        ))}
      </div>

      {/* Hero Progress */}
      <div className="bg-pokemon-light border-2 border-pokemon-border rounded p-6">
        <h3 className="font-press-start text-sm text-pokemon-dark mb-4">Hero Progress</h3>
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
                <div className="mt-2 text-right">
                  <span className="font-mono text-xs text-pokemon-dark">
                    {(xp % 1000).toLocaleString()} / 1000 XP
                  </span>
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
