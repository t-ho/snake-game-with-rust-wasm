use super::snake::SnakeCell;
use crate::rnd::rnd;

pub struct Jungle {
    pub width: usize,
    pub size: usize,
    pub food_cell: usize,
}

impl Jungle {
    pub fn new(width: usize) -> Self {
        let size = width * width;
        Self {
            width,
            size,
            food_cell: 0, // Will be set after snake is created
        }
    }

    pub fn generate_food(&mut self, snake_body: &[SnakeCell]) {
        self.food_cell = Self::gen_food_cell(self.size, snake_body);
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
}

