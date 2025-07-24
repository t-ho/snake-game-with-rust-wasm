import "./style.css";
import init, { Game } from "../pkg/snake_game_with_rust_wasm";
import { rnd } from "./utils/rnd";
import { GAME_CONFIG } from "./config/constants";
import { createGameTemplate } from "./ui/template";
import { getGameElements } from "./ui/elements";
import { GameRenderer } from "./renderer/canvas";
import { GameController } from "./game/controller";

class SnakeGameApp {
  private renderer: GameRenderer | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private game: Game | null = null;

  private async init(): Promise<void> {
    // Initialize WASM
    const wasm = await init();

    // Set up DOM
    this.setupDOM();

    // Get UI elements
    const elements = getGameElements();
    this.canvas = elements.canvas;

    // Setup canvas
    this.setupCanvas(elements.canvas);

    // Create game instance
    const snakeSpawnIdx = rnd(
      GAME_CONFIG.JUNGLE_WIDTH * GAME_CONFIG.JUNGLE_WIDTH,
    );
    this.game = Game.new(GAME_CONFIG.JUNGLE_WIDTH, snakeSpawnIdx);

    // Create renderer
    this.renderer = new GameRenderer(elements.ctx, wasm);

    // Create controller
    const controller = new GameController(this.game, elements, this.renderer);

    // Setup resize handler
    this.setupResizeHandler();

    // Initial render
    controller.initialRender();
  }

  private setupDOM(): void {
    const appElement = document.querySelector<HTMLDivElement>("#app")!;
    appElement.innerHTML = createGameTemplate();
  }

  private setupCanvas(canvas: HTMLCanvasElement): void {
    const { CELL_SIZE, JUNGLE_WIDTH } = GAME_CONFIG;
    canvas.width = JUNGLE_WIDTH * CELL_SIZE;
    canvas.height = JUNGLE_WIDTH * CELL_SIZE;
  }

  private setupResizeHandler(): void {
    let resizeTimeout: number | undefined;

    window.addEventListener("resize", () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        if (this.canvas && this.renderer && this.game) {
          this.setupCanvas(this.canvas);
          // Re-render the game after canvas resize
          this.renderer.render(this.game);
        }
      }, 250);
    });
  }

  public async start(): Promise<void> {
    try {
      await this.init();
    } catch (error) {
      console.error("Failed to start Snake Game:", error);
    }
  }
}

// Start the application
const app = new SnakeGameApp();
app.start();
