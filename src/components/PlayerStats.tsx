
import React, { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import type { Player } from '../services/api';
import { Swords, Skull, Trophy, Star, Flame, Coins, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';

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

const calculateHeroLevel = (xp: number, levelScale: number): number => {
  return Math.floor(Math.cbrt(xp / levelScale));
};

const calculateProgress = (xp: number, levelScale: number): number => {
  const currentLevel = calculateHeroLevel(xp, levelScale);
  const currentLevelXP = levelScale * Math.pow(currentLevel, 3);
  const nextLevelXP = levelScale * Math.pow(currentLevel + 1, 3);
  return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
};

const calculateAbilityLevel = (xp: number, levelScale: number): number => {
  return Math.floor(Math.cbrt(xp / levelScale));
};

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  const [expandedHero, setExpandedHero] = useState<string | null>(null);

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

  const heroQueries = useQueries({
    queries: Object.keys(player.heroes).map((hero) => ({
      queryKey: ['hero', hero],
      queryFn: () => api.getHeroData(hero),
    }))
  });

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <h2 className="font-press-start text-xl text-pokemon-dark mb-6 text-center">{player.name}</h2>
      
      {/* General Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {stats.map(({ icon: Icon, label, value }, index) => (
          <div 
            key={label} 
            className="bg-pokemon-light border-2 border-pokemon-border rounded p-4 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="text-pokemon-green" size={20} />
              <span className="font-press-start text-xs text-pokemon-dark">{label}</span>
            </div>
            <span className="font-mono text-lg text-pokemon-dark">{value}</span>
          </div>
        ))}
      </div>

      {/* Hero Progress */}
      <div className="bg-pokemon-light border-2 border-pokemon-border rounded p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <h3 className="font-press-start text-sm text-pokemon-dark mb-4">Hero Progress</h3>
        <div className="grid gap-4">
          {Object.entries(player.heroes).map(([hero, skills], index) => {
            const heroData = heroQueries[index].data;
            const totalXP = Object.values(skills as HeroSkills).reduce((total, abilities) => {
              return total + Object.values(abilities).reduce((sum, { experiencePoints }) => sum + experiencePoints, 0);
            }, 0);
            
            const levelScale = heroData?.properties?.[Object.keys(heroData.properties)[0]]?.[0]?.levelScale || 315;
            const level = calculateHeroLevel(totalXP, levelScale);
            const progress = calculateProgress(totalXP, levelScale);
            const isExpanded = expandedHero === hero;
            
            return (
              <div 
                key={hero} 
                className="border-2 border-pokemon-border rounded p-4 animate-fade-in transition-all duration-300"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <button 
                  onClick={() => setExpandedHero(isExpanded ? null : hero)}
                  className="w-full transition-colors duration-200 hover:bg-pokemon-green/5 rounded"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-pokemon-dark capitalize">{hero}</span>
                      <div className="transition-transform duration-300">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                    <span className="font-press-start text-sm text-pokemon-green">Lv.{level}</span>
                  </div>
                  <div className="w-full bg-pokemon-gray/20 rounded h-4 overflow-hidden">
                    <div
                      className="h-full bg-pokemon-green transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <span className="font-mono text-xs text-pokemon-dark">
                      {totalXP.toLocaleString()} XP
                    </span>
                  </div>
                </button>

                {/* Ability Details */}
                <div className={`mt-4 pl-4 border-l-2 border-pokemon-border overflow-hidden transition-all duration-300 ease-out ${
                  isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {Object.entries(skills as HeroSkills).map(([skillName, abilities], skillIndex) => {
                    const skillData = heroData?.properties?.[skillName];
                    const skillXP = Object.values(abilities).reduce((sum, { experiencePoints }) => sum + experiencePoints, 0);
                    const abilityLevelScale = skillData?.[0]?.levelScale || 315;
                    const abilityLevel = calculateAbilityLevel(skillXP, abilityLevelScale);
                    
                    return (
                      <div 
                        key={skillName} 
                        className="mb-4 last:mb-0 animate-fade-in"
                        style={{ animationDelay: `${skillIndex * 100}ms` }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-mono text-sm text-pokemon-dark capitalize">
                            {skillName.replace(/_/g, ' ')}
                          </span>
                          <span className="font-press-start text-xs text-pokemon-green">
                            Lv.{abilityLevel}
                          </span>
                        </div>
                        <div className="w-full bg-pokemon-gray/20 rounded h-2 overflow-hidden">
                          <div
                            className="h-full bg-pokemon-green/50 transition-all duration-700 ease-out"
                            style={{ width: `${(skillXP / (Math.pow(abilityLevel + 1, 3) * abilityLevelScale)) * 100}%` }}
                          />
                        </div>
                        <div className="mt-1 text-right">
                          <span className="font-mono text-xs text-pokemon-dark/75">
                            {skillXP.toLocaleString()} XP
                          </span>
                        </div>
                      </div>
                    );
                  })}
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
