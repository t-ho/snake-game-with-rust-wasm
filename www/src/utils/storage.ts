interface GameStats {
  highScore: number;
  gamesPlayed: number;
  lastPlayed: string;
}

const STORAGE_KEY = 'snake-game-stats';

export class GameStorage {
  private static getStats(): GameStats {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load game stats from localStorage:', error);
    }
    
    // Return default stats if nothing stored or error occurred
    return {
      highScore: 0,
      gamesPlayed: 0,
      lastPlayed: new Date().toISOString(),
    };
  }

  private static saveStats(stats: GameStats): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
      console.warn('Failed to save game stats to localStorage:', error);
    }
  }

  public static getHighScore(): number {
    return this.getStats().highScore;
  }

  public static getGamesPlayed(): number {
    return this.getStats().gamesPlayed;
  }

  public static getLastPlayed(): string {
    return this.getStats().lastPlayed;
  }

  public static recordGameEnd(score: number): boolean {
    const stats = this.getStats();
    const isNewHighScore = score > stats.highScore;
    
    const updatedStats: GameStats = {
      highScore: Math.max(score, stats.highScore),
      gamesPlayed: stats.gamesPlayed + 1,
      lastPlayed: new Date().toISOString(),
    };

    this.saveStats(updatedStats);
    return isNewHighScore;
  }

  public static clearStats(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear game stats from localStorage:', error);
    }
  }
}