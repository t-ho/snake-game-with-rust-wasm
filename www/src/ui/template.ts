export const createGameTemplate = (): string => `
  <div class="game-container">
    <div class="game-header">
      <h1 class="game-title">Snake Game</h1>
      <p class="game-subtitle">Built with Rust & WebAssembly</p>
    </div>

    <div class="game-card">
      <div class="game-stats">
        <div class="stat-item">
          <span class="stat-label">Status</span>
          <span id="game-status" class="stat-value">Press Play to Start</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Points</span>
          <span id="game-points" class="stat-value">0</span>
        </div>
      </div>

      <div class="game-canvas-container">
        <canvas id="jungle-canvas"></canvas>
      </div>

      <div class="game-controls">
        <div class="speed-controls">
          <button id="speed-down" class="btn btn-outline btn-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <span id="speed-display" class="speed-display">Speed: 2x</span>
          <button id="speed-up" class="btn btn-outline btn-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        <button id="play-button" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
          Play
        </button>
      </div>

      <div class="game-instructions">
        <div class="instruction-item">
          <kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd>
          <span>Arrow keys to move</span>
        </div>
        <div class="instruction-item">
          <kbd>Space</kbd>
          <span>Pause/Resume game</span>
        </div>
      </div>
    </div>
  </div>
`;
