import "./style.css";
import init, {
  Game,
  Direction,
  GameStatus,
} from "../pkg/snake_game_with_rust_wasm";
import type { InitOutput } from "../pkg/snake_game_with_rust_wasm";
import { rnd } from "./utils/rnd";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="game-container">
    <h1 class="game-title">Snake Game</h1>

    <div class="game-controls">
      <div id="game-status">Press Play to Start</div>
      <div id="game-points">Points: 0</div>
      <div class="speed-controls">
        <button id="speed-down">«</button>
        <span id="speed-display">Speed: 1x</span>
        <button id="speed-up">»</button>
      </div>
      <button id="play-button">Play</button>
    </div>

    <div class="game-canvas-container">
      <canvas id="jungle-canvas"></canvas>
    </div>

    <div class="game-instructions">
      Use arrow keys to move the snake
    </div>
  </div>
`;

const CELL_SIZE = 20;
const JUNGLE_WIDTH = 20;

let gameRunning = false;
let animationId: number;
let gameSpeed = 1; // Speed multiplier (1x, 2x, 3x, etc.)
const BASE_FPS = 4;
const MIN_SPEED = 1;
const MAX_SPEED = 5;

async function start() {
  const wasm = await init();
  const snakeSpawnIdx = rnd(JUNGLE_WIDTH * JUNGLE_WIDTH);
  const game = Game.new(JUNGLE_WIDTH, snakeSpawnIdx);

  const canvas = document.getElementById("jungle-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  canvas.width = JUNGLE_WIDTH * CELL_SIZE;
  canvas.height = JUNGLE_WIDTH * CELL_SIZE;

  const statusElement = document.getElementById(
    "game-status",
  ) as HTMLDivElement;
  const pointsElement = document.getElementById(
    "game-points",
  ) as HTMLDivElement;
  const playButton = document.getElementById(
    "play-button",
  ) as HTMLButtonElement;
  const speedUpButton = document.getElementById(
    "speed-up",
  ) as HTMLButtonElement;
  const speedDownButton = document.getElementById(
    "speed-down",
  ) as HTMLButtonElement;
  const speedDisplay = document.getElementById(
    "speed-display",
  ) as HTMLSpanElement;

  function updateSpeedDisplay() {
    speedDisplay.textContent = `Speed: ${gameSpeed}x`;
    speedDownButton.disabled = gameSpeed <= MIN_SPEED;
    speedUpButton.disabled = gameSpeed >= MAX_SPEED;
  }

  function updateStatus() {
    const status = game.status();
    pointsElement.textContent = `Points: ${game.points()}`;
    updateSpeedDisplay();

    switch (status) {
      case GameStatus.Playing:
        statusElement.textContent = "Playing - Use arrow keys to move";
        playButton.textContent = "Playing...";
        disableButton();
        break;
      case GameStatus.Won:
        statusElement.textContent = "You Won! 🎉";
        playButton.textContent = "Play Again";
        enableButton();
        gameRunning = false;
        break;
      case GameStatus.Lost:
        statusElement.textContent = "Game Over! 💀";
        playButton.textContent = "Play Again";
        enableButton();
        gameRunning = false;
        break;
      default:
        statusElement.textContent = "Press Play to Start";
        playButton.textContent = "Play";
        enableButton();
        break;
    }
  }

  function enableButton() {
    playButton.disabled = false;
  }

  function disableButton() {
    playButton.disabled = true;
  }

  function startGame() {
    disableButton();
    playButton.textContent = "Starting...";

    game.reset();
    game.start();
    gameRunning = true;

    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    updateStatus();
    update();
  }

  playButton.addEventListener("click", startGame);

  speedUpButton.addEventListener("click", () => {
    if (gameSpeed < MAX_SPEED) {
      gameSpeed++;
      updateSpeedDisplay();
    }
  });

  speedDownButton.addEventListener("click", () => {
    if (gameSpeed > MIN_SPEED) {
      gameSpeed--;
      updateSpeedDisplay();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!gameRunning) return;

    switch (event.code) {
      case "ArrowUp": {
        game.change_snake_direction(Direction.Up);
        event.preventDefault();
        break;
      }
      case "ArrowRight": {
        game.change_snake_direction(Direction.Right);
        event.preventDefault();
        break;
      }
      case "ArrowDown": {
        game.change_snake_direction(Direction.Down);
        event.preventDefault();
        break;
      }
      case "ArrowLeft": {
        game.change_snake_direction(Direction.Left);
        event.preventDefault();
        break;
      }
      default:
    }
  });

  function update() {
    const fps = BASE_FPS * gameSpeed;
    setTimeout(() => {
      if (!gameRunning) return;

      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      game.step();
      paint(wasm, ctx, game);
      updateStatus();

      if (gameRunning) {
        animationId = requestAnimationFrame(update);
      }
    }, 1000 / fps);
  }

  // Initial render
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  paint(wasm, ctx, game);
  updateStatus();
}

function drawJungle(ctx: CanvasRenderingContext2D, game: Game) {
  const jungleWidth = game.jungle_width();
  ctx.beginPath();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;

  for (let x = 0; x <= jungleWidth; x++) {
    ctx.moveTo(x * CELL_SIZE, 0);
    ctx.lineTo(x * CELL_SIZE, jungleWidth * CELL_SIZE);
  }

  for (let y = 0; y <= jungleWidth; y++) {
    ctx.moveTo(0, y * CELL_SIZE);
    ctx.lineTo(jungleWidth * CELL_SIZE, y * CELL_SIZE);
  }

  ctx.stroke();
}

function drawSnake(
  wasm: InitOutput,
  ctx: CanvasRenderingContext2D,
  game: Game,
) {
  const snakeCells = new Uint32Array(
    wasm.memory.buffer,
    game.snake_cells_ptr(),
    game.snake_length(),
  );

  snakeCells.forEach((cellIdx, i) => {
    const jungleWidth = game.jungle_width();
    const col = cellIdx % jungleWidth;
    const row = Math.floor(cellIdx / jungleWidth);

    ctx.fillStyle = i === 0 ? "#4fc3f7" : "#81c784";
    ctx.fillRect(
      col * CELL_SIZE + 1,
      row * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2,
    );
  });
}

function drawFood(ctx: CanvasRenderingContext2D, game: Game) {
  const foodCellIdx = game.food_cell();
  const width = game.jungle_width();
  const col = foodCellIdx % width;
  const row = Math.floor(foodCellIdx / width);

  ctx.fillStyle = "#ff5722";
  ctx.fillRect(
    col * CELL_SIZE + 1,
    row * CELL_SIZE + 1,
    CELL_SIZE - 2,
    CELL_SIZE - 2,
  );
}

function paint(wasm: InitOutput, ctx: CanvasRenderingContext2D, game: Game) {
  drawJungle(ctx, game);
  drawSnake(wasm, ctx, game);
  drawFood(ctx, game);
}

start().catch(console.error);
