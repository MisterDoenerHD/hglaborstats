
import axios from 'axios';

const API_BASE_URL = 'https://api.hglabor.de';

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

export const api = {
  async getTopPlayers(): Promise<Player[]> {
    const response = await axios.get(`${API_BASE_URL}/stats/heroes/leaderboard`);
    return response.data;
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
