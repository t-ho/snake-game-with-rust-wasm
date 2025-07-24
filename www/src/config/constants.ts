export const getResponsiveCellSize = (): number => {
  if (typeof window !== "undefined") {
    return window.innerWidth <= 768 ? 15 : 20;
  }
  return 20;
};

export const GAME_CONFIG = {
  get CELL_SIZE() {
    return getResponsiveCellSize();
  },
  JUNGLE_WIDTH: 20,
  BASE_FPS: 4,
  MIN_SPEED: 1,
  MAX_SPEED: 5,
} as const;

export const COLORS = {
  BACKGROUND: "#1a1a1a",
  GRID: "#333",
  SNAKE_HEAD: "#4fc3f7",
  SNAKE_BODY: "#81c784",
  FOOD: "#ff5722",
} as const;
