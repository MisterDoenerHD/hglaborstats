
import axios from 'axios';

const API_BASE_URL = 'https://api.hglabor.de';
const PLAYERDB_API_URL = 'https://playerdb.co/api/player/minecraft';

export interface Player {
  name: string;
  uuid: string;
  heroes: {
    [key: string]: {
      level: number;
      xp: number;
    };
  };
}

interface PlayerDBResponse {
  data: {
    player: {
      username: string;
    };
  };
}

async function getPlayerNameFromUUID(uuid: string): Promise<string> {
  try {
    const response = await axios.get<PlayerDBResponse>(`${PLAYERDB_API_URL}/${uuid}`);
    return response.data.data.player.username;
  } catch (error) {
    console.error('Failed to fetch player name:', error);
    return uuid; // Fallback to UUID if name lookup fails
  }
}

export const api = {
  async getTopPlayers(): Promise<Player[]> {
    const response = await axios.get(`${API_BASE_URL}/stats/ffa/top`);
    const players = response.data;
    
    // Convert UUIDs to usernames for each player
    const playersWithNames = await Promise.all(
      players.map(async (player: any) => ({
        ...player,
        name: await getPlayerNameFromUUID(player.uuid),
      }))
    );
    
    return playersWithNames;
  },

  async searchPlayer(name: string): Promise<Player | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/heroes/player/${name}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
};
