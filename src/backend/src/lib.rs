use ic_cdk_macros::{export_candid, init, post_upgrade, pre_upgrade, query, update};

#[ic_cdk::update]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// Generate did files

export_candid!();