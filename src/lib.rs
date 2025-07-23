use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Jungle {
    width: usize,
}

#[wasm_bindgen]
impl Jungle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self::default()
    }

    #[wasm_bindgen(getter)]
    pub fn width(&self) -> usize {
        self.width
    }
}

impl Default for Jungle {
    fn default() -> Self {
        Self { width: 20 }
    }
}
