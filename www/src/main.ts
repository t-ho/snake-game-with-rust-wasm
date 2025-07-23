import "./style.css";
import init, { Jungle } from "../pkg/snake_game_with_rust_wasm";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Snake Game</h1>
    <canvas id="jungle-canvas"></canvas>
  </div>
`;

const CELL_SIZE = 20;

async function start() {
  await init();

  const jungle = new Jungle();
  const jungleWidth = jungle.width;

  const canvas = document.getElementById("jungle-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  canvas.width = jungleWidth * CELL_SIZE;
  canvas.height = jungleWidth * CELL_SIZE;

  drawGrid(ctx, jungleWidth);
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number) {
  ctx.beginPath();

  for (let x = 0; x <= width; x++) {
    ctx.moveTo(x * CELL_SIZE, 0);
    ctx.lineTo(x * CELL_SIZE, width * CELL_SIZE);
  }

  for (let y = 0; y <= width; y++) {
    ctx.moveTo(0, y * CELL_SIZE);
    ctx.lineTo(width * CELL_SIZE, y * CELL_SIZE);
  }

  ctx.stroke();
}

start().catch(console.error);
