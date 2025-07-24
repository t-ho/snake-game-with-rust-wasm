# Snake Game with Rust + WebAssembly + TypeScript

A modern Snake game implementation showcasing the power of **Rust + WebAssembly + TypeScript**. Features high-performance game logic in Rust compiled to WebAssembly, with a sleek TypeScript frontend using Vite and modern web technologies.

## 📸 Screenshot

![Snake Game Screenshot](www/public/screenshot.png)

## 🎮 Features

- **Classic Snake gameplay** with wraparound borders
- **Cartoon-style snake** with eyes and tongue animation
- **Points system** - earn points by eating food
- **Real-time score display**
- **Responsive controls** using arrow keys
- **Adjustable speed controls** - 5 speed levels (1x to 5x)
- **Game states** - Playing, Won, Lost
- **20x20 game board** for extended gameplay
- **Shadcn/ui inspired design** with modern card-based layout
- **Dark/light mode support** with CSS custom properties

## 🛠️ Technology Stack

### Core Technologies

- **Rust** - High-performance game logic and algorithms
- **WebAssembly** - Seamless integration between Rust and JavaScript
- **TypeScript** - Type-safe frontend development with modern ES features

### Build & Development

- **wasm-pack** - Rust to WebAssembly compilation
- **Vite** - Fast development server and build tool
- **Inter Font** - Modern typography with advanced OpenType features

### Architecture

- **Modular design** - Clean separation of concerns across multiple modules
- **CSS Custom Properties** - Modern styling with CSS variables
- **SVG Icons** - Scalable vector graphics for UI elements

## 📁 Project Structure

```
snake-game-with-rust-wasm/
├── 🦀 Rust + WebAssembly Backend
│   ├── Cargo.toml             # Rust package configuration
│   ├── Cargo.lock             # Dependency lock file
│   └── src/                   # Rust source code
│       ├── lib.rs             # Main library entry point
│       ├── direction.rs       # Movement direction enum
│       ├── game.rs            # Game coordinator & WASM interface
│       ├── rnd.rs             # Random number utilities
│       └── game/              # Core game modules
│           ├── jungle.rs      # Game board & food management
│           ├── snake.rs       # Snake entity & movement logic
│           └── status.rs      # Game state enum
│
└── 🎨 TypeScript Frontend
    └── www/
        ├── package.json       # Node.js dependencies
        ├── tsconfig.json      # TypeScript configuration
        ├── index.html         # HTML entry point
        ├── src/
        │   ├── main.ts        # Application bootstrapper
        │   ├── style.css      # Shadcn/ui inspired styles
        │   ├── config/
        │   │   └── constants.ts    # Game configuration & colors
        │   ├── ui/
        │   │   ├── template.ts     # HTML template generator
        │   │   ├── elements.ts     # DOM element helpers
        │   │   └── icons.ts        # SVG icon components
        │   ├── game/
        │   │   └── controller.ts   # Game state management
        │   ├── renderer/
        │   │   └── canvas.ts       # Canvas rendering engine
        │   └── utils/
        │       └── rnd.ts          # Frontend random utilities
        ├── dist/              # Production build output
        └── pkg/               # Generated WASM bindings
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
   git clone https://github.com/t-ho/snake-game-with-rust-wasm.git
   cd snake-game-with-rust-wasm
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
3. **Adjust game speed** using the « and » buttons (1x to 5x speed)
4. **Eat the red food** to grow the snake and earn points
5. **Avoid hitting yourself** - the game ends if the snake collides with its body
6. **Win condition** - Fill the entire board with the snake
7. **Restart** - Click "Play Again" after game over

## 🏗️ Architecture Overview

### 🦀 Rust + WebAssembly Backend

```rust
// High-performance game logic compiled to WebAssembly
Game::new() -> Game           // Game coordinator exposed to JS
├── Snake                     // Entity with movement & collision logic
├── Jungle                    // Board management & food generation
├── Direction                 // Movement enums (Up, Down, Left, Right)
└── GameStatus               // State tracking (Playing, Won, Lost)
```

### 🎨 Modern TypeScript Frontend

```typescript
// Modular, type-safe frontend architecture
SnakeGameApp                 // Application bootstrapper
├── GameController           // State management & event handling
├── GameRenderer            // Canvas drawing & animation engine
├── UI Components           // Template, elements, icons
└── Configuration           // Constants & color schemes
```

### 🔧 Key Design Principles

- **Performance First**: Rust handles compute-intensive game logic
- **Type Safety**: Full TypeScript coverage with strict mode enabled
- **Modular Design**: Clean separation of concerns across layers
- **Memory Efficiency**: Direct WASM memory access for snake cells
- **Modern Web**: CSS custom properties, ES2022 features, Vite bundling

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
