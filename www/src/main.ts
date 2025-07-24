import "./style.css";
import init, { Jungle, Direction } from "../pkg/snake_game_with_rust_wasm";
import type { InitOutput } from "../pkg/snake_game_with_rust_wasm";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Snake Game</h1>
    <canvas id="jungle-canvas"></canvas>
  </div>
`;

const CELL_SIZE = 20;
const JUNGLE_WIDTH = 8;

const snakeSpawnIdx = Date.now() % (JUNGLE_WIDTH * JUNGLE_WIDTH);

async function start() {
  const wasm = await init();

  const jungle = Jungle.new(JUNGLE_WIDTH, snakeSpawnIdx);
  const jungleWidth = jungle.width();

  const canvas = document.getElementById("jungle-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  canvas.width = jungleWidth * CELL_SIZE;
  canvas.height = jungleWidth * CELL_SIZE;

  document.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "ArrowUp": {
        jungle.change_snake_direction(Direction.Up);
        break;
      }
      case "ArrowRight": {
        jungle.change_snake_direction(Direction.Right);
        break;
      }
      case "ArrowDown": {
        jungle.change_snake_direction(Direction.Down);
        break;
      }
      case "ArrowLeft": {
        jungle.change_snake_direction(Direction.Left);
        break;
      }
      default:
    }
  });

  function update(ctx: CanvasRenderingContext2D, jungle: Jungle) {
    const fps = 5;
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      jungle.step();
      paint(wasm, ctx, jungle);
      requestAnimationFrame(() => update(ctx, jungle));
    }, 1000 / fps);
  }

  paint(wasm, ctx, jungle);
  update(ctx, jungle);
}

function drawJungle(ctx: CanvasRenderingContext2D, jungle: Jungle) {
  ctx.beginPath();
  const jungleWidth = jungle.width();

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
  jungle: Jungle,
) {
  const jungleWidth = jungle.width();
  const snakeCellPtr = jungle.snake_cells_ptr();
  const snakeLength = jungle.snake_length();
  const snakeCells = new Uint32Array(
    wasm.memory.buffer,
    snakeCellPtr,
    snakeLength,
  );

  ctx.beginPath();
  snakeCells.forEach((cellIdx, i) => {
    const col = cellIdx % jungleWidth;
    const row = Math.floor(cellIdx / jungleWidth);

    ctx.fillStyle = i === 0 ? "#7878db" : "#000";
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  });
  ctx.stroke();
}

function paint(
  wasm: InitOutput,
  ctx: CanvasRenderingContext2D,
  jungle: Jungle,
) {
  drawJungle(ctx, jungle);
  drawSnake(wasm, ctx, jungle);
}

start().catch(console.error);
