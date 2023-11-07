// build: "cargo build --target wasm32-unknown-unknown -p reducer --release"

use serde::Deserialize;
use sqlsync_reducer::{execute, init_reducer, types::ReducerError};

#[derive(Deserialize, Debug)]
#[serde(tag = "tag")]
enum Mutation {
    InitSchema,

    PopulateDB,

    CreateLocation { id: String, description: String },

    DeleteLocation { id: String },

    CreateRobot { id: String, locationid: String, description: String },

    DeleteRobot { id: String },

    CreateTask { id: String, robotid: String, description: String },

    DeleteTask { id: String },

    ToggleCompleted { id: String }
}

init_reducer!(reducer);
async fn reducer(mutation: Vec<u8>) -> Result<(), ReducerError> {
    let mutation: Mutation = serde_json::from_slice(&mutation[..])?;

    match mutation {
        Mutation::InitSchema => {
            execute!(
                "CREATE TABLE IF NOT EXISTS locations (
                    id TEXT PRIMARY KEY,
                    description TEXT UNIQUE NOT NULL,
                    created_at TEXT NOT NULL
                )"
            )
            .await;
            execute!(
                "CREATE TABLE IF NOT EXISTS robots (
                    id TEXT PRIMARY KEY,
                    locationid TEXT NOT NULL,
                    description TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )"
            )
            .await;
            execute!(
                "CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    robotid TEXT NOT NULL,
                    description TEXT NOT NULL,
                    completed BOOLEAN NOT NULL,
                    created_at TEXT NOT NULL
                )"
            )
            .await;
        }

        Mutation::PopulateDB => {
            execute!(
                "INSERT OR IGNORE INTO locations (id, description, created_at) VALUES (?, ?, datetime('now'))",
                "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                "Warehouse"
            ).await;
            execute!(
                "INSERT OR IGNORE INTO robots (id, locationid, description, created_at) VALUES (?, ?, ?, datetime('now'))",
                "24db4c5b-1e3a-4853-8316-1d6ad07beed1",
                "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                "ABB IRB 52 001"
            ).await;
            execute!(
                "INSERT OR IGNORE INTO robots (id, locationid, description, created_at) VALUES (?, ?, ?, datetime('now'))",
                "402e7545-512b-4b7d-b570-e94311b38ab6",
                "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                "ABB IRB 52 002"
            ).await;
            execute!(
                "INSERT OR IGNORE INTO robots (id, locationid, description, created_at) VALUES (?, ?, ?, datetime('now'))",
                "f7a3408d-6329-47fd-ada9-72e6f249c3e2",
                "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                "ABB IRB 52 003"
            ).await;
            execute!(
                "INSERT OR IGNORE INTO robots (id, locationid, description, created_at) VALUES (?, ?, ?, datetime('now'))",
                "c583ab7f-fd7d-4100-9c3e-aa343ea1c232",
                "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                "ABB IRB 52 004"
            ).await;
        }

        Mutation::CreateLocation { id, description } => {
            log::debug!("appending location({}): {}", id, description);
            execute!(
                "insert into locations (id, description, created_at)
                    values (?, ?, datetime('now'))",
                id,
                description
            ).await;
        }

        Mutation::DeleteLocation { id } => {
            execute!(
                "delete from locations where id = ?", id
            ).await;
        }

        Mutation::CreateRobot { id, locationid, description } => {
            log::debug!("appending robot({}): {}", id, description);
            execute!(
                "insert into robots (id, locationid, description, created_at)
                    values (?, ?, ?, datetime('now'))",
                id,
                locationid,
                description
            ).await;
        }

        Mutation::DeleteRobot { id } => {
            execute!(
                "delete from robots where id = ?", id
            ).await;
        }

        Mutation::CreateTask { id, robotid, description } => {
            log::debug!("appending task({}) to robot({}): {}", id, robotid, description);
            execute!(
                "insert into tasks (id, robotid, description, completed, created_at)
                    values (?, ?, ?, false, datetime('now'))",
                id,
                robotid,
                description
            )
            .await;
        }

        Mutation::DeleteTask { id } => {
            execute!("delete from tasks where id = ?", id).await;
        }

        Mutation::ToggleCompleted { id } => {
            execute!(
                "update tasks set completed = not completed where id = ?",
                id
            )
            .await;
        }
    }

    Ok(())
}
