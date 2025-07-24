use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

#[derive(Clone)]
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
pub struct Jungle {
    width: usize,
    size: usize,
    snake: Snake,
    next_cell: Option<SnakeCell>,
}

#[wasm_bindgen]
impl Jungle {
    pub fn new(width: usize, snake_idx: usize) -> Self {
        Self {
            width,
            size: width * width,
            snake: Snake::new(snake_idx, 3),
            next_cell: None,
        }
    }

    pub fn width(&self) -> usize {
        self.width
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
        let temp = self.snake.body.clone();

        match self.next_cell.take() {
            Some(cell) => {
                self.snake.body[0] = cell;
            }
            None => {
                self.snake.body[0] = self.gen_next_snake_cell(&self.snake.direction);
            }
        }

        let len = self.snake.body.len();

        for i in 1..len {
            self.snake.body[i] = SnakeCell(temp[i - 1].0);
        }
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
