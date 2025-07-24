export interface GameElements {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  statusElement: HTMLDivElement;
  pointsElement: HTMLDivElement;
  playButton: HTMLButtonElement;
  speedUpButton: HTMLButtonElement;
  speedDownButton: HTMLButtonElement;
  speedDisplay: HTMLSpanElement;
}

export const getGameElements = (): GameElements => {
  const canvas = document.getElementById("jungle-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  return {
    canvas,
    ctx,
    statusElement: document.getElementById("game-status") as HTMLDivElement,
    pointsElement: document.getElementById("game-points") as HTMLDivElement,
    playButton: document.getElementById("play-button") as HTMLButtonElement,
    speedUpButton: document.getElementById("speed-up") as HTMLButtonElement,
    speedDownButton: document.getElementById("speed-down") as HTMLButtonElement,
    speedDisplay: document.getElementById("speed-display") as HTMLSpanElement,
  };
};

