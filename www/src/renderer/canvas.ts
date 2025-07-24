import type { InitOutput } from "../../pkg/snake_game_with_rust_wasm";
import { Game, Direction } from "../../pkg/snake_game_with_rust_wasm";
import { GAME_CONFIG, COLORS } from "../config/constants";

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private wasm: InitOutput;

  constructor(ctx: CanvasRenderingContext2D, wasm: InitOutput) {
    this.ctx = ctx;
    this.wasm = wasm;
  }

  render(game: Game): void {
    this.clearCanvas();
    this.drawJungle(game);
    this.drawSnake(game);
    this.drawFood(game);
  }

  private clearCanvas(): void {
    const { canvas } = this.ctx;
    this.ctx.fillStyle = COLORS.BACKGROUND;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private drawJungle(game: Game): void {
    const jungleWidth = game.jungle_width();
    const { CELL_SIZE } = GAME_CONFIG;

    this.ctx.beginPath();
    this.ctx.strokeStyle = COLORS.GRID;
    this.ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= jungleWidth; x++) {
      this.ctx.moveTo(x * CELL_SIZE, 0);
      this.ctx.lineTo(x * CELL_SIZE, jungleWidth * CELL_SIZE);
    }

    // Draw horizontal lines
    for (let y = 0; y <= jungleWidth; y++) {
      this.ctx.moveTo(0, y * CELL_SIZE);
      this.ctx.lineTo(jungleWidth * CELL_SIZE, y * CELL_SIZE);
    }

    this.ctx.stroke();
  }

  private drawSnake(game: Game): void {
    const snakeCells = new Uint32Array(
      this.wasm.memory.buffer,
      game.snake_cells_ptr(),
      game.snake_length(),
    );

    const jungleWidth = game.jungle_width();
    const { CELL_SIZE } = GAME_CONFIG;
    const direction = game.snake_direction();

    snakeCells.forEach((cellIdx, i) => {
      const col = cellIdx % jungleWidth;
      const row = Math.floor(cellIdx / jungleWidth);
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      if (i === 0) {
        // 🐍 Draw directional snake head
        this.drawSnakeHead(x, y, direction);
      } else {
        // 🟩 Draw body cell
        this.ctx.fillStyle = COLORS.SNAKE_BODY;
        this.ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      }
    });
  }

  private drawSnakeHead(x: number, y: number, direction: Direction): void {
    const { CELL_SIZE } = GAME_CONFIG;
    const radius = CELL_SIZE / 4;

    // Draw rounded head shape
    this.ctx.fillStyle = COLORS.SNAKE_HEAD;
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + CELL_SIZE - radius, y);
    this.ctx.quadraticCurveTo(x + CELL_SIZE, y, x + CELL_SIZE, y + radius);
    this.ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE - radius);
    this.ctx.quadraticCurveTo(
      x + CELL_SIZE,
      y + CELL_SIZE,
      x + CELL_SIZE - radius,
      y + CELL_SIZE,
    );
    this.ctx.lineTo(x + radius, y + CELL_SIZE);
    this.ctx.quadraticCurveTo(x, y + CELL_SIZE, x, y + CELL_SIZE - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.fill();

    // Direction-based features
    this.drawDirectionalFeatures(x, y, direction);
  }

  private drawDirectionalFeatures(
    x: number,
    y: number,
    direction: Direction,
  ): void {
    const { CELL_SIZE } = GAME_CONFIG;

    switch (direction) {
      case Direction.Up:
        // Eyes at top
        this.drawEye(x + CELL_SIZE * 0.3, y + CELL_SIZE * 0.25);
        this.drawEye(x + CELL_SIZE * 0.7, y + CELL_SIZE * 0.25);
        // Tongue at top
        this.drawTongue(x + CELL_SIZE / 2, y - 2, x + CELL_SIZE / 2, y - 7);
        break;

      case Direction.Down:
        // Eyes at bottom
        this.drawEye(x + CELL_SIZE * 0.3, y + CELL_SIZE * 0.75);
        this.drawEye(x + CELL_SIZE * 0.7, y + CELL_SIZE * 0.75);
        // Tongue at bottom
        this.drawTongue(
          x + CELL_SIZE / 2,
          y + CELL_SIZE + 2,
          x + CELL_SIZE / 2,
          y + CELL_SIZE + 7,
        );
        break;

      case Direction.Left:
        // Eyes at left
        this.drawEye(x + CELL_SIZE * 0.25, y + CELL_SIZE * 0.3);
        this.drawEye(x + CELL_SIZE * 0.25, y + CELL_SIZE * 0.7);
        // Tongue at left
        this.drawTongue(x - 2, y + CELL_SIZE / 2, x - 7, y + CELL_SIZE / 2);
        break;

      case Direction.Right:
      default:
        // Eyes at right (default)
        this.drawEye(x + CELL_SIZE * 0.75, y + CELL_SIZE * 0.3);
        this.drawEye(x + CELL_SIZE * 0.75, y + CELL_SIZE * 0.7);
        // Tongue at right
        this.drawTongue(
          x + CELL_SIZE + 2,
          y + CELL_SIZE / 2,
          x + CELL_SIZE + 7,
          y + CELL_SIZE / 2,
        );
        break;
    }
  }

  private drawEye(x: number, y: number): void {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Black pupil
    this.ctx.fillStyle = "#000000";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 1, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawTongue(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ): void {
    this.ctx.strokeStyle = "#ff4d4d";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
  }

  private drawFood(game: Game): void {
    const foodCellIdx = game.food_cell();
    const width = game.jungle_width();
    const { CELL_SIZE } = GAME_CONFIG;

    const col = foodCellIdx % width;
    const row = Math.floor(foodCellIdx / width);

    this.ctx.fillStyle = COLORS.FOOD;
    this.ctx.fillRect(
      col * CELL_SIZE + 1,
      row * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2,
    );
  }
}
