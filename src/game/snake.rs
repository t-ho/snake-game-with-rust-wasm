use super::status::GameStatus;
use crate::direction::Direction;

#[derive(Clone, Copy, PartialEq)]
pub struct SnakeCell(pub usize);

pub struct Snake {
    pub body: Vec<SnakeCell>,
    pub direction: Direction,
    pub next_cell: Option<SnakeCell>,
}

impl Snake {
    pub fn new(spawn_index: usize, size: usize) -> Self {
        let mut body = vec![];

        for i in 0..size {
            body.push(SnakeCell(spawn_index - i));
        }

        Self {
            body,
            direction: Direction::Right, // Default direction
            next_cell: None,
        }
    }

    pub fn head_idx(&self) -> usize {
        self.body[0].0
    }

    pub fn cells_ptr(&self) -> *const SnakeCell {
        self.body.as_ptr()
    }

    pub fn length(&self) -> usize {
        self.body.len()
    }

    pub fn direction(&self) -> Direction {
        self.direction
    }

    pub fn move_snake(&mut self, jungle_width: usize, jungle_size: usize) -> Option<GameStatus> {
        let new_head_cell = match self.next_cell.take() {
            Some(cell) => cell,
            None => self.gen_next_cell(&self.direction, jungle_width, jungle_size),
        };

        // Check if new head position collides with body (excluding tail which will move)
        let body_without_tail = &self.body[..self.body.len() - 1];
        if body_without_tail.contains(&new_head_cell) {
            return Some(GameStatus::Lost);
        }

        let len = self.body.len();

        // Move snake body in reverse order (tail to head)
        for i in (1..len).rev() {
            self.body[i] = self.body[i - 1];
        }

        // Set new head
        self.body[0] = new_head_cell;

        None
    }

    pub fn get_tail(&self) -> SnakeCell {
        self.body[self.body.len() - 1]
    }

    pub fn grow(&mut self, old_tail: SnakeCell, jungle_size: usize) -> Option<GameStatus> {
        self.body.push(old_tail);

        // Check win condition (snake fills entire board)
        if self.body.len() == jungle_size {
            Some(GameStatus::Won)
        } else {
            None
        }
    }

    pub fn change_direction(
        &mut self,
        direction: Direction,
        jungle_width: usize,
        jungle_size: usize,
    ) {
        let next_cell = self.gen_next_cell(&direction, jungle_width, jungle_size);

        if self.body[1].0 == next_cell.0 {
            return; // Prevents the snake from reversing direction
        }

        self.next_cell = Some(next_cell);
        self.direction = direction;
    }

    fn gen_next_cell(&self, direction: &Direction, width: usize, size: usize) -> SnakeCell {
        let snake_head = self.head_idx();

        match direction {
            Direction::Up => {
                if snake_head < width {
                    // Top row - wrap to bottom
                    SnakeCell(size - width + snake_head)
                } else {
                    SnakeCell(snake_head - width)
                }
            }
            Direction::Down => {
                let next_pos = snake_head + width;
                if next_pos >= size {
                    // Bottom row - wrap to top
                    SnakeCell(snake_head + width - size)
                } else {
                    SnakeCell(next_pos)
                }
            }
            Direction::Left => {
                // Calculate row start using division, then check if we're at row start
                let row = snake_head / width;
                let row_start = row * width;
                if snake_head == row_start {
                    // Left edge - wrap to right end of same row
                    SnakeCell(row_start + width - 1)
                } else {
                    SnakeCell(snake_head - 1)
                }
            }
            Direction::Right => {
                // Calculate row start using division, then check if we're at row end
                let row = snake_head / width;
                let row_start = row * width;
                if snake_head == row_start + width - 1 {
                    // Right edge - wrap to left start of same row
                    SnakeCell(row_start)
                } else {
                    SnakeCell(snake_head + 1)
                }
            }
        }
    }
}
