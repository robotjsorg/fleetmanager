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

    UpdateRobot { id: String, state: String },

    CreateTask { id: String, robotid: String, description: String },

    DeleteTask { id: String },

    UpdateTask { id: String, state: String }
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
                    state TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )"
            )
            .await;
            execute!(
                "CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    robotid TEXT NOT NULL,
                    description TEXT NOT NULL,
                    state TEXT NOT NULL,
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
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
                    "24db4c5b-1e3a-4853-8316-1d6ad07beed1",
                    "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                    "Rusty",
                    "Auto"
                ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "48228b08-1b8a-4d54-9b90-16f1f73fb1cc",
                        "24db4c5b-1e3a-4853-8316-1d6ad07beed1",
                        "Random positions (continuous)",
                        "Queued"
                    ).await;
                execute!(
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
                    "402e7545-512b-4b7d-b570-e94311b38ab6",
                    "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                    "D.A.R.Y.L.",
                    "Auto"
                ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "ea131ae6-13a8-4a23-9436-5f46f3dcffd1",
                        "402e7545-512b-4b7d-b570-e94311b38ab6",
                        "Move pre-pick",
                        "Queued"
                    ).await;
                execute!(
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
                    "f7a3408d-6329-47fd-ada9-72e6f249c3e2",
                    "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                    "Nozzle",
                    "Off"
                ).await;
                execute!(
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
                    "c583ab7f-fd7d-4100-9c3e-aa343ea1c232",
                    "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                    "Sprocket",
                    "Off"
                ).await;
            execute!(
                "INSERT OR IGNORE INTO locations (id, description, created_at) VALUES (?, ?, datetime('now'))",
                "ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d",
                "Apartment"
            ).await;
                execute!(
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
                    "d544e656-0e8c-4c3d-91fc-02e38b326c47",
                    "ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d",
                    "House Bot 1",
                    "Off"
                ).await;
                execute!(
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
                    "6d83797f-32ba-4884-bd55-5c116f6d74e7",
                    "ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d",
                    "House Bot 2",
                    "Off"
                ).await;
        }

        Mutation::CreateLocation { id, description } => {
            log::debug!("appending location({}): {}", id, description);
            execute!(
                "INSERT INTO locations (id, description, created_at)
                    VALUES (?, ?, datetime('now'))",
                id,
                description
            ).await;
        }

        Mutation::DeleteLocation { id } => {
            execute!(
                "DELETE FROM locations WHERE id = ?", id
            ).await;
        }

        Mutation::CreateRobot { id, locationid, description } => {
            log::debug!("appending robot({}): {}", id, description);
            execute!(
                "INSERT INTO robots (id, locationid, description, state, created_at, updated_at)
                    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
                id,
                locationid,
                description,
                "Off"
            ).await;
        }

        Mutation::DeleteRobot { id } => {
            execute!(
                "DELETE FROM robots WHERE id = ?", id
            ).await;
        }

        Mutation::UpdateRobot { id, state } => {
            execute!(
                "UPDATE robots SET state = ?, updated_at = datetime('now') WHERE id = ?",
                state,
                id
            )
            .await;
        }

        Mutation::CreateTask { id, robotid, description } => {
            log::debug!("appending task({}) to robot({}): {}", id, robotid, description);
            execute!(
                "INSERT INTO tasks (id, robotid, description, state, created_at)
                    VALUES (?, ?, ?, ?, datetime('now'))",
                id,
                robotid,
                description,
                "Queued"
            )
            .await;
        }

        Mutation::DeleteTask { id } => {
            execute!("DELETE FROM tasks WHERE id = ?", id).await;
        }

        Mutation::UpdateTask { id, state } => {
            execute!(
                "UPDATE tasks SET state = ? WHERE id = ?",
                state,
                id
            )
            .await;
        }
    }

    Ok(())
}
