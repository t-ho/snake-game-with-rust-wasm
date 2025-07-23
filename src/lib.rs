use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(format!("Hello, {name}!").as_str());
}

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}
