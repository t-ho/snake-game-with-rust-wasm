# Snake Game with Rust and WebAssembly

A classic Snake game implementation built with Rust and WebAssembly, featuring a modern TypeScript frontend using Vite. The game demonstrates the power of combining Rust's performance with WebAssembly's portability for web-based games.

## 🎮 Features

- **Classic Snake gameplay** with wraparound borders
- **Points system** - earn points by eating food
- **Real-time score display**
- **Responsive controls** using arrow keys
- **Game states** - Playing, Won, Lost
- **20x20 game board** for extended gameplay
- **Clean, modern UI** with CSS styling

## 🛠️ Technology Stack

- **Backend**: Rust with WebAssembly (wasm-bindgen)
- **Frontend**: TypeScript + Vite
- **Build Tools**: wasm-pack, Vite, TypeScript compiler
- **Package Management**: Cargo (Rust), Yarn (Node.js)

## 📁 Project Structure

```
snake_game_with_rust_wasm/
├── Cargo.toml                 # Rust package configuration
├── Cargo.lock                 # Rust dependency lock file
├── src/                       # Rust source code
│   ├── lib.rs                 # Main library entry point
│   ├── direction.rs           # Direction enum for snake movement
│   ├── game.rs                # Main game logic and WASM interface
│   ├── rnd.rs                 # Random number generation utilities
│   └── game/                  # Game modules
│       ├── jungle.rs          # Game board and food management
│       ├── snake.rs           # Snake entity logic
│       └── status.rs          # Game status enum
└── www/                       # Frontend web application
    ├── package.json           # Node.js package configuration
    ├── tsconfig.json          # TypeScript configuration
    ├── index.html             # Main HTML entry point
    ├── src/
    │   ├── main.ts            # Main TypeScript application
    │   ├── style.css          # CSS styles
    │   └── utils/
    │       └── rnd.ts         # Random utilities for frontend
    ├── dist/                  # Built frontend assets
    └── pkg/                   # Generated WASM bindings
```

## 🚀 Getting Started

### Prerequisites

- **Rust** (latest stable version)
- **Node.js** (v16 or later)
- **Yarn** package manager
- **wasm-pack** tool for building WebAssembly packages

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd snake_game_with_rust_wasm
   ```

2. **Install wasm-pack** (if not already installed):
   ```bash
   cargo install wasm-pack
   ```

3. **Install frontend dependencies**:
   ```bash
   cd www
   yarn install
   ```

### Development

1. **Start the development server**:
   ```bash
   cd www
   yarn dev
   ```
   This will:
   - Build the Rust code to WebAssembly
   - Start the Vite development server
   - Open the game in your browser (usually at `http://localhost:5173`)

2. **Build for production**:
   ```bash
   cd www
   yarn build
   ```

3. **Preview production build**:
   ```bash
   cd www
   yarn preview
   ```

### Available Scripts

From the `www/` directory:

- `yarn wasm` - Build only the WebAssembly module
- `yarn dev` - Build WASM + start development server
- `yarn build` - Build WASM + create production build
- `yarn preview` - Preview production build locally

## 🎯 How to Play

1. **Start the game** by clicking the "Play" button
2. **Move the snake** using arrow keys:
   - ↑ Up Arrow - Move up
   - ↓ Down Arrow - Move down
   - ← Left Arrow - Move left
   - → Right Arrow - Move right
3. **Eat the red food** to grow the snake and earn points
4. **Avoid hitting yourself** - the game ends if the snake collides with its body
5. **Win condition** - Fill the entire board with the snake
6. **Restart** - Click "Play Again" after game over

## 🏗️ Architecture

### Rust/WebAssembly Layer

- **Game struct**: Main game coordinator exposed to JavaScript
- **Snake module**: Handles snake movement, growth, and collision detection
- **Jungle module**: Manages the game board and food generation
- **Direction enum**: Represents movement directions
- **GameStatus enum**: Tracks game states (Playing, Won, Lost)

### TypeScript Frontend

- **Main application**: Handles UI, canvas rendering, and game loop
- **WASM integration**: Imports and uses the Rust-generated WebAssembly module
- **Canvas rendering**: Draws the game board, snake, and food
- **Event handling**: Processes keyboard input and game controls

### Key Design Decisions

- **Modular architecture**: Rust code is organized into focused modules
- **Memory efficiency**: Direct memory access for snake cells via pointers
- **Performance optimization**: Eliminated expensive clone operations in movement logic
- **Clean separation**: Game logic in Rust, rendering and UI in TypeScript

## 🔧 Configuration

### Rust Configuration (Cargo.toml)
- **Edition**: 2024 (latest Rust edition)
- **Crate type**: `cdylib` for WebAssembly compilation
- **Dependencies**: `wasm-bindgen` for JS/WASM interop

### TypeScript Configuration (tsconfig.json)
- **Target**: ES2022 for modern JavaScript features
- **Module**: ESNext with bundler resolution
- **Strict typing**: Enabled for better code quality

## 🐛 Troubleshooting

### Common Issues

1. **WASM build fails**: Ensure `wasm-pack` is installed and up to date
2. **TypeScript errors**: Check that all dependencies are installed with `yarn install`
3. **Game not loading**: Verify that the WASM module builds successfully before starting dev server

### Development Tips

- The game automatically rebuilds WASM when you run `yarn dev`
- Changes to Rust code require rebuilding the WASM module
- TypeScript changes are hot-reloaded by Vite
- Check browser console for any runtime errors

## 📝 License

This project is available under the MIT License.
