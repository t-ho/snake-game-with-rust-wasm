use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "/www/src/utils/rnd.ts")]
extern "C" {
    pub fn rnd(max: usize) -> usize;
}