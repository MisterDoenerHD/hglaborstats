
import axios from 'axios';

const API_BASE_URL = 'https://api.hglabor.de';
const PLAYERDB_API_URL = 'https://playerdb.co/api/player/minecraft';

interface HeroAbility {
  [key: string]: {
    experiencePoints: number;
  };
}

interface HeroSkill {
  [key: string]: HeroAbility;
}

export interface Player {
  name: string;
  playerId: string;
  xp: number;
  kills: number;
  deaths: number;
  currentKillStreak: number;
  highestKillStreak: number;
  bounty: number;
  heroes: {
    [heroName: string]: HeroSkill;
  };
}

interface PlayerDBResponse {
  data: {
    player: {
      username: string;
    };
  };
}

export type SortField = 'kills' | 'deaths' | 'xp' | 'currentKillStreak' | 'highestKillStreak' | 'bounty';

async function getPlayerNameFromUUID(uuid: string): Promise<string> {
  try {
    const formattedUUID = uuid.replace(
      /(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/,
      '$1-$2-$3-$4-$5'
    );
    const response = await axios.get<PlayerDBResponse>(`${PLAYERDB_API_URL}/${formattedUUID}`);
    return response.data.data.player.username;
  } catch (error) {
    console.error('Failed to fetch player name:', error);
    return uuid;
  }
}

export const api = {
  async getTopPlayers(sort: SortField = 'kills', page: number = 1): Promise<Player[]> {
    const response = await axios.get(`${API_BASE_URL}/stats/ffa/top`, {
      params: {
        sort,
        page
      }
    });
    const players = response.data;
    
    const playersWithNames = await Promise.all(
      players.map(async (player: any) => ({
        ...player,
        name: await getPlayerNameFromUUID(player.playerId),
      }))
    );
    
    return playersWithNames;
  },

  async searchPlayer(name: string): Promise<Player | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/stats/heroes/player/${name}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
};
