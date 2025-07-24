import "./style.css";
import init, {
  Jungle,
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
const JUNGLE_WIDTH = 8;

let gameRunning = false;
let animationId: number;

async function start() {
  const wasm = await init();
  const snakeSpawnIdx = rnd(JUNGLE_WIDTH * JUNGLE_WIDTH);
  const jungle = Jungle.new(JUNGLE_WIDTH, snakeSpawnIdx);

  const canvas = document.getElementById("jungle-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  canvas.width = JUNGLE_WIDTH * CELL_SIZE;
  canvas.height = JUNGLE_WIDTH * CELL_SIZE;

  const statusElement = document.getElementById(
    "game-status",
  ) as HTMLDivElement;
  const playButton = document.getElementById(
    "play-button",
  ) as HTMLButtonElement;

  function updateStatus() {
    const status = jungle.status();
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

    jungle.reset_game();
    jungle.start_game();
    gameRunning = true;

    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    updateStatus();
    update();
  }

  playButton.addEventListener("click", startGame);

  document.addEventListener("keydown", (event) => {
    if (!gameRunning) return;

    switch (event.code) {
      case "ArrowUp": {
        jungle.change_snake_direction(Direction.Up);
        event.preventDefault();
        break;
      }
      case "ArrowRight": {
        jungle.change_snake_direction(Direction.Right);
        event.preventDefault();
        break;
      }
      case "ArrowDown": {
        jungle.change_snake_direction(Direction.Down);
        event.preventDefault();
        break;
      }
      case "ArrowLeft": {
        jungle.change_snake_direction(Direction.Left);
        event.preventDefault();
        break;
      }
      default:
    }
  });

  function update() {
    const fps = 5;
    setTimeout(() => {
      if (!gameRunning) return;

      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      jungle.step();
      paint(wasm, ctx, jungle);
      updateStatus();

      if (gameRunning) {
        animationId = requestAnimationFrame(update);
      }
    }, 1000 / fps);
  }

  // Initial render
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  paint(wasm, ctx, jungle);
  updateStatus();
}

function drawJungle(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;

  for (let x = 0; x <= JUNGLE_WIDTH; x++) {
    ctx.moveTo(x * CELL_SIZE, 0);
    ctx.lineTo(x * CELL_SIZE, JUNGLE_WIDTH * CELL_SIZE);
  }

  for (let y = 0; y <= JUNGLE_WIDTH; y++) {
    ctx.moveTo(0, y * CELL_SIZE);
    ctx.lineTo(JUNGLE_WIDTH * CELL_SIZE, y * CELL_SIZE);
  }

  ctx.stroke();
}

function drawSnake(
  wasm: InitOutput,
  ctx: CanvasRenderingContext2D,
  jungle: Jungle,
) {
  const snakeCells = new Uint32Array(
    wasm.memory.buffer,
    jungle.snake_cells_ptr(),
    jungle.snake_length(),
  );

  snakeCells.forEach((cellIdx, i) => {
    const col = cellIdx % JUNGLE_WIDTH;
    const row = Math.floor(cellIdx / JUNGLE_WIDTH);

    ctx.fillStyle = i === 0 ? "#4fc3f7" : "#81c784";
    ctx.fillRect(
      col * CELL_SIZE + 1,
      row * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2,
    );
  });
}

function drawFood(ctx: CanvasRenderingContext2D, jungle: Jungle) {
  const foodCellIdx = jungle.food_cell();
  const col = foodCellIdx % JUNGLE_WIDTH;
  const row = Math.floor(foodCellIdx / JUNGLE_WIDTH);

  ctx.fillStyle = "#ff5722";
  ctx.fillRect(
    col * CELL_SIZE + 1,
    row * CELL_SIZE + 1,
    CELL_SIZE - 2,
    CELL_SIZE - 2,
  );
}

function paint(
  wasm: InitOutput,
  ctx: CanvasRenderingContext2D,
  jungle: Jungle,
) {
  drawJungle(ctx);
  drawSnake(wasm, ctx, jungle);
  drawFood(ctx, jungle);
}

start().catch(console.error);
