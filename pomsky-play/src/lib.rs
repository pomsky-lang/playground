use rulex::options::{CompileOptions, ParseOptions, RegexFlavor};
use rulex::Rulex;
use wasm_bindgen::prelude::*;

mod utils;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
/// Returns
///
/// 1. Success (bool)
/// 2. Output if successful; error message if unsuccessful
/// 3. Help message
/// 4. Span prefix
/// 5. Span content
/// 6. Span suffix
pub fn compile(input: &str, flavor: &str) -> Vec<JsValue> {
    utils::set_panic_hook();

    let flavor = match flavor {
        "javascript" | "js" => RegexFlavor::JavaScript,
        "java" => RegexFlavor::Java,
        "dotnet" | ".net" => RegexFlavor::DotNet,
        "pcre" => RegexFlavor::Pcre,
        "python" => RegexFlavor::Python,
        "ruby" => RegexFlavor::Ruby,
        "rust" => RegexFlavor::Rust,
        _ => {
            return vec![
                false.into(),
                format!("Unknown regex flavor `{flavor}`").into(),
            ]
        }
    };

    match Rulex::parse_and_compile(
        input,
        ParseOptions {
            max_range_size: 12,
            ..Default::default()
        },
        CompileOptions { flavor },
    ) {
        Ok(output) => {
            vec![true.into(), output.into()]
        }
        Err(err) => {
            let d = err.diagnostic(input);

            let range = d.span.range();
            let (prefix, content, suffix) = split_in_three(input, range.start, range.end);

            vec![
                false.into(),
                d.msg.into(),
                d.help.into(),
                prefix.into(),
                content.into(),
                suffix.into(),
            ]
        }
    }
}

fn split_in_three(input: &str, cut1: usize, cut2: usize) -> (&str, &str, &str) {
    let (rest, suffix) = input.split_at(cut2);
    let (prefix, middle) = rest.split_at(cut1);
    (prefix, middle, suffix)
}
