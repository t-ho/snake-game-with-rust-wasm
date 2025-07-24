import {
  Game,
  GameStatus,
  Direction,
} from "../../pkg/snake_game_with_rust_wasm";
import type { GameElements } from "../ui/elements";
import type { GameRenderer } from "../renderer/canvas";
import { GAME_CONFIG } from "../config/constants";
import { ICONS } from "../ui/icons";

export class GameController {
  private gameRunning = false;
  private animationId = 0;
  private gameSpeed = 1;
  private game: Game;
  private elements: GameElements;
  private renderer: GameRenderer;

  constructor(game: Game, elements: GameElements, renderer: GameRenderer) {
    this.game = game;
    this.elements = elements;
    this.renderer = renderer;
    this.setupEventListeners();
    this.updateUI();
  }

  private setupEventListeners(): void {
    this.elements.playButton.addEventListener("click", () =>
      this.handlePlayButtonClick(),
    );

    this.elements.speedUpButton.addEventListener("click", () => {
      if (this.gameSpeed < GAME_CONFIG.MAX_SPEED) {
        this.gameSpeed++;
        this.updateSpeedDisplay();
      }
    });

    this.elements.speedDownButton.addEventListener("click", () => {
      if (this.gameSpeed > GAME_CONFIG.MIN_SPEED) {
        this.gameSpeed--;
        this.updateSpeedDisplay();
      }
    });

    document.addEventListener("keydown", (event) => this.handleKeyPress(event));
  }

  private handleKeyPress(event: KeyboardEvent): void {
    // Handle pause/resume with spacebar during gameplay
    if (event.code === "Space" && this.gameRunning) {
      this.togglePause();
      event.preventDefault();
      return;
    }

    // Only handle movement when game is running and not paused
    if (!this.gameRunning || this.game.status() === GameStatus.Paused) return;

    switch (event.code) {
      case "ArrowUp":
        this.game.change_snake_direction(Direction.Up);
        event.preventDefault();
        break;
      case "ArrowRight":
        this.game.change_snake_direction(Direction.Right);
        event.preventDefault();
        break;
      case "ArrowDown":
        this.game.change_snake_direction(Direction.Down);
        event.preventDefault();
        break;
      case "ArrowLeft":
        this.game.change_snake_direction(Direction.Left);
        event.preventDefault();
        break;
    }
  }

  private handlePlayButtonClick(): void {
    const status = this.game.status();

    if (status === GameStatus.Paused) {
      this.resumeGame();
    } else if (status === GameStatus.Playing) {
      this.pauseGame();
    } else {
      this.startGame();
    }
  }

  private togglePause(): void {
    const status = this.game.status();

    if (status === GameStatus.Playing) {
      this.pauseGame();
    } else if (status === GameStatus.Paused) {
      this.resumeGame();
    }
  }

  private pauseGame(): void {
    this.game.pause();
    this.updateUI();
  }

  private resumeGame(): void {
    this.game.resume();
    this.updateUI();
    // Restart the game loop when resuming
    this.gameLoop();
  }

  private startGame(): void {
    this.setButtonDisabled(true);
    this.elements.playButton.innerHTML = `${ICONS.loading} Starting...`;

    this.game.reset();
    this.game.start();
    this.gameRunning = true;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.updateUI();
    this.gameLoop();
  }

  private gameLoop(): void {
    const status = this.game.status();

    // If paused, stop the game loop entirely
    if (status === GameStatus.Paused) {
      return;
    }

    const fps = GAME_CONFIG.BASE_FPS * this.gameSpeed;

    setTimeout(() => {
      if (!this.gameRunning) return;

      this.game.step();
      this.renderer.render(this.game);
      this.updateUI();

      if (this.gameRunning) {
        this.animationId = requestAnimationFrame(() => this.gameLoop());
      }
    }, 1000 / fps);
  }

  private updateUI(): void {
    this.updateStatus();
    this.updatePoints();
    this.updateSpeedDisplay();
  }

  private updateStatus(): void {
    const status = this.game.status();

    switch (status) {
      case GameStatus.Playing:
        this.elements.statusElement.textContent = "Playing";
        this.elements.playButton.innerHTML = `${ICONS.pause} Pause`;
        this.setButtonDisabled(false);
        break;
      case GameStatus.Paused:
        this.elements.statusElement.textContent = "Paused";
        this.elements.playButton.innerHTML = `${ICONS.play} Resume`;
        this.setButtonDisabled(false);
        break;
      case GameStatus.Won:
        this.elements.statusElement.textContent = "You Won! 🎉";
        this.elements.playButton.innerHTML = `${ICONS.play} Play Again`;
        this.setButtonDisabled(false);
        this.gameRunning = false;
        break;
      case GameStatus.Lost:
        this.elements.statusElement.textContent = "Game Over 💀";
        this.elements.playButton.innerHTML = `${ICONS.play} Play Again`;
        this.setButtonDisabled(false);
        this.gameRunning = false;
        break;
      default:
        this.elements.statusElement.textContent = "Press Play to Start";
        this.elements.playButton.innerHTML = `${ICONS.play} Play`;
        this.setButtonDisabled(false);
        break;
    }
  }

  private updatePoints(): void {
    this.elements.pointsElement.textContent = `${this.game.points()}`;
  }

  private updateSpeedDisplay(): void {
    this.elements.speedDisplay.textContent = `Speed: ${this.gameSpeed}x`;
    this.elements.speedDownButton.disabled =
      this.gameSpeed <= GAME_CONFIG.MIN_SPEED;
    this.elements.speedUpButton.disabled =
      this.gameSpeed >= GAME_CONFIG.MAX_SPEED;
  }

  private setButtonDisabled(disabled: boolean): void {
    this.elements.playButton.disabled = disabled;
  }

  public initialRender(): void {
    this.renderer.render(this.game);
  }
}
