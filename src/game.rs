pub use self::jungle::Jungle;
pub use self::snake::{Snake, SnakeCell};
pub use self::status::GameStatus;
use crate::direction::Direction;
use crate::rnd::rnd;
use wasm_bindgen::prelude::*;

pub mod jungle;
pub mod snake;
pub mod status;

#[wasm_bindgen]
pub struct Game {
    jungle: Jungle,
    snake: Snake,
    status: Option<GameStatus>,
    points: usize,
}

#[wasm_bindgen]
impl Game {
    pub fn new(width: usize, snake_idx: usize) -> Self {
        let snake = Snake::new(snake_idx, 3);
        let mut jungle = Jungle::new(width);
        jungle.generate_food(&snake.body);

        Self {
            jungle,
            snake,
            status: None,
            points: 0,
        }
    }

    pub fn jungle_width(&self) -> usize {
        self.jungle.width
    }

    pub fn food_cell(&self) -> usize {
        self.jungle.food_cell
    }

    pub fn status(&self) -> Option<GameStatus> {
        self.status
    }

    pub fn points(&self) -> usize {
        self.points
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.head_idx()
    }

    pub fn snake_cells_ptr(&self) -> *const SnakeCell {
        self.snake.cells_ptr()
    }

    pub fn snake_length(&self) -> usize {
        self.snake.length()
    }

    pub fn snake_direction(&self) -> Direction {
        self.snake.direction()
    }

    pub fn step(&mut self) {
        match self.status {
            Some(GameStatus::Playing) => {
                let old_tail = self.snake.get_tail();

                // Move snake and check for collision
                if let Some(game_status) =
                    self.snake.move_snake(self.jungle.width, self.jungle.size)
                {
                    self.status = Some(game_status);
                    return;
                }

                // Check if food eaten
                if self.jungle.food_cell == self.snake.head_idx() {
                    self.points += 1;

                    // Check for win condition
                    if let Some(game_status) = self.snake.grow(old_tail, self.jungle.size) {
                        self.status = Some(game_status);
                        return;
                    }

                    self.jungle.generate_food(&self.snake.body);
                }
            }
            Some(GameStatus::Paused) => {
                // Do nothing when paused - maintain current state
            }
            _ => {
                self.status = None;
            }
        }
    }

    pub fn start(&mut self) {
        if self.status.is_none() {
            self.status = Some(GameStatus::Playing);
        }
    }

    pub fn pause(&mut self) {
        if matches!(self.status, Some(GameStatus::Playing)) {
            self.status = Some(GameStatus::Paused);
        }
    }

    pub fn resume(&mut self) {
        if matches!(self.status, Some(GameStatus::Paused)) {
            self.status = Some(GameStatus::Playing);
        }
    }

    pub fn reset(&mut self) {
        let snake_spawn_idx = rnd(self.jungle.size);
        self.snake = Snake::new(snake_spawn_idx, 3);
        self.jungle.generate_food(&self.snake.body);
        self.status = None;
        self.points = 0;
    }

    pub fn change_snake_direction(&mut self, direction: Direction) {
        self.snake
            .change_direction(direction, self.jungle.width, self.jungle.size);
    }
}
