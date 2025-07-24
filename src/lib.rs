use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "/www/src/utils/rnd.ts")]
extern "C" {
    fn rnd(max: usize) -> usize;
}

#[wasm_bindgen]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

#[derive(Clone, PartialEq)]
pub struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    fn new(spawn_index: usize, size: usize) -> Self {
        let mut body = vec![];

        for i in 0..size {
            body.push(SnakeCell(spawn_index - i));
        }

        Self {
            body,
            direction: Direction::Right, // Default direction,
        }
    }
}

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub enum GameStatus {
    Won,
    Lost,
    Playing,
}

#[wasm_bindgen]
pub struct Jungle {
    width: usize,
    size: usize,
    snake: Snake,
    next_cell: Option<SnakeCell>,
    food_cell: usize,
    status: Option<GameStatus>,
}

#[wasm_bindgen]
impl Jungle {
    pub fn new(width: usize, snake_idx: usize) -> Self {
        let snake = Snake::new(snake_idx, 3);
        let size = width * width;
        let food_cell = Self::gen_food_cell(size, &snake.body);

        Self {
            width,
            size,
            snake,
            next_cell: None,
            food_cell,
            status: None,
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn food_cell(&self) -> usize {
        self.food_cell
    }

    pub fn status(&self) -> Option<GameStatus> {
        self.status
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
    }

    // *const is raw pointer
    // borrowing rules do not apply to it
    pub fn snake_cells_ptr(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }

    // Cannot return a reference to a vector to JavaScript because of borrowing rules.
    // pub fn snake_cells(&self) -> &Vec<SnakeCell> {
    //     &self.snake.body
    // }

    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }

    pub fn step(&mut self) {
        match self.status {
            Some(GameStatus::Playing) => {
                let temp = self.snake.body.clone();
                let new_head_cell = match self.next_cell.take() {
                    Some(cell) => cell,
                    None => self.gen_next_snake_cell(&self.snake.direction),
                };

                // Check if new head position collides with body (excluding tail which will move)
                let body_without_tail = &self.snake.body[..self.snake.body.len() - 1];
                if body_without_tail.contains(&new_head_cell) {
                    self.status = Some(GameStatus::Lost);
                    return;
                }

                // Move snake
                self.snake.body[0] = new_head_cell;
                let len = self.snake.body.len();

                for i in 1..len {
                    self.snake.body[i] = SnakeCell(temp[i - 1].0);
                }

                // Check if food eaten
                if self.food_cell == self.snake_head_idx() {
                    self.snake.body.push(SnakeCell(temp[len - 1].0));

                    // Check win condition (snake fills entire board)
                    if self.snake.body.len() == self.size {
                        self.status = Some(GameStatus::Won);
                        return;
                    }

                    self.food_cell = Self::gen_food_cell(self.size, &self.snake.body);
                }
            }
            _ => {
                self.status = None;
            }
        }
    }

    pub fn start_game(&mut self) {
        if self.status.is_none() {
            self.status = Some(GameStatus::Playing);
        }
    }

    pub fn reset_game(&mut self) {
        let snake_spawn_idx = rnd(self.size);
        self.snake = Snake::new(snake_spawn_idx, 3);
        self.next_cell = None;
        self.food_cell = Self::gen_food_cell(self.size, &self.snake.body);
        self.status = None;
    }

    fn gen_food_cell(max: usize, snake_body: &[SnakeCell]) -> usize {
        let mut food_cell;

        loop {
            food_cell = rnd(max);
            if !snake_body.contains(&SnakeCell(food_cell)) {
                break;
            }
        }
        food_cell
    }

    fn gen_next_snake_cell(&self, direction: &Direction) -> SnakeCell {
        let snake_head = self.snake_head_idx();
        let row = snake_head / self.width;

        match direction {
            Direction::Up => {
                let threshold = snake_head - row * self.width;
                if snake_head == threshold {
                    SnakeCell(self.size - self.width + threshold)
                } else {
                    SnakeCell(snake_head - self.width)
                }
            }
            Direction::Down => {
                let threshold = snake_head + ((self.width - row) * self.width);
                if snake_head + self.width == threshold {
                    SnakeCell(threshold - ((row + 1) * self.width))
                } else {
                    SnakeCell(snake_head + self.width)
                }
            }

            Direction::Left => {
                let threshold = row * self.width;
                if snake_head == threshold {
                    SnakeCell(threshold + (self.width - 1))
                } else {
                    SnakeCell(snake_head - 1)
                }
            }
            Direction::Right => {
                let threshold = (row + 1) * self.width;
                if snake_head + 1 >= threshold {
                    SnakeCell(threshold - self.width)
                } else {
                    SnakeCell(snake_head + 1)
                }
            }
        }
    }

    pub fn change_snake_direction(&mut self, direction: Direction) {
        let next_cell = self.gen_next_snake_cell(&direction);

        if self.snake.body[1].0 == next_cell.0 {
            return;
        }

        self.next_cell = Some(next_cell);
        self.snake.direction = direction;
    }
}
