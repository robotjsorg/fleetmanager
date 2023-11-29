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
 
    CreateRobot { id: String, locationid: String, description: String, x: f32, z: f32, theta: f32 },

    DeleteRobot { id: String },

    UpdateRobotState { id: String, state: String },

    UpdateRobotPosition { id: String, x: f32, z: f32, theta: f32 },

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
                    updated_at TEXT NOT NULL,
                    x FLOAT NOT NULL,
                    z FLOAT NOT NULL,
                    theta FLOAT NOT NULL
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
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at, x, z, theta) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?)",
                    "24db4c5b-1e3a-4853-8316-1d6ad07beed1",
                    "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                    "Rusty",
                    "Auto",
                    1.0, 1.0, 2.355
                ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "48228b08-1b8a-4d54-9b90-16f1f73fb1cc",
                        "24db4c5b-1e3a-4853-8316-1d6ad07beed1",
                        "Move pre-pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "3f6a9edb-aeb7-4dd4-9025-cbf306b79b31",
                        "24db4c5b-1e3a-4853-8316-1d6ad07beed1",
                        "Move pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "a16e07c1-0a02-46a5-9616-af68377e9a5b",
                        "24db4c5b-1e3a-4853-8316-1d6ad07beed1",
                        "Move post-pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "c6380b22-7a6c-47db-9b77-cce8fd815dec",
                        "24db4c5b-1e3a-4853-8316-1d6ad07beed1",
                        "Move pre-place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "77529737-904a-4d55-aa0c-30a69ca5f06b",
                        "24db4c5b-1e3a-4853-8316-1d6ad07beed1",
                        "Move place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "24e6452c-75b5-4cff-8bdc-811b6e38d58d",
                        "24db4c5b-1e3a-4853-8316-1d6ad07beed1",
                        "Move post-place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "9d8286ce-b319-4442-b9b0-81bbef1e59d5",
                        "24db4c5b-1e3a-4853-8316-1d6ad07beed1",
                        "Home",
                        "Queued"
                    ).await;
                execute!(
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at, x, z, theta) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?)",
                    "402e7545-512b-4b7d-b570-e94311b38ab6",
                    "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                    "D.A.R.Y.L.",
                    "Auto",
                    1, -1, -2.355
                ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "ea131ae6-13a8-4a23-9436-5f46f3dcffd1",
                        "402e7545-512b-4b7d-b570-e94311b38ab6",
                        "Move pre-pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "db9cb069-80f4-4437-8c28-2bfdf6ee6ffe",
                        "402e7545-512b-4b7d-b570-e94311b38ab6",
                        "Move pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "d6251c03-f599-4364-9ebe-2fa45cfcd7a8",
                        "402e7545-512b-4b7d-b570-e94311b38ab6",
                        "Move post-pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "010dd323-c702-4d84-9eac-c14b1a88c311",
                        "402e7545-512b-4b7d-b570-e94311b38ab6",
                        "Move pre-place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "13d61ca5-6a9b-4566-920f-fc07ce266c4c",
                        "402e7545-512b-4b7d-b570-e94311b38ab6",
                        "Move place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "4b920927-6051-479b-9d23-f2eb8ded0832",
                        "402e7545-512b-4b7d-b570-e94311b38ab6",
                        "Move post-place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "9be5ed70-c6dd-47cc-80e7-c269aa51a858",
                        "402e7545-512b-4b7d-b570-e94311b38ab6",
                        "Home",
                        "Queued"
                    ).await;
                execute!(
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at, x, z, theta) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?)",
                    "f7a3408d-6329-47fd-ada9-72e6f249c3e2",
                    "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                    "Nozzle",
                    "Auto",
                    -1, -1, -0.785
                ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "720187e4-94f4-4a11-b998-5938554a2fb4",
                        "f7a3408d-6329-47fd-ada9-72e6f249c3e2",
                        "Move pre-pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "76a07539-d0e9-41cc-b3ff-30b60e07507b",
                        "f7a3408d-6329-47fd-ada9-72e6f249c3e2",
                        "Move pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "b274c685-e6b1-4fa0-8148-46c3dda13553",
                        "f7a3408d-6329-47fd-ada9-72e6f249c3e2",
                        "Move post-pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "509342e5-4cc9-4eff-8fcd-38a7ec2b1082",
                        "f7a3408d-6329-47fd-ada9-72e6f249c3e2",
                        "Move pre-place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "bb3e7a54-3702-4d0b-8b0e-709505411a09",
                        "f7a3408d-6329-47fd-ada9-72e6f249c3e2",
                        "Move place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "8646dac1-7b3d-420e-8ed8-251bedca9c1d",
                        "f7a3408d-6329-47fd-ada9-72e6f249c3e2",
                        "Move post-place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "828a86e1-6c24-4f44-9ae2-839355ae5f9d",
                        "f7a3408d-6329-47fd-ada9-72e6f249c3e2",
                        "Home",
                        "Queued"
                    ).await;
                execute!(
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at, x, z, theta) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?)",
                    "c583ab7f-fd7d-4100-9c3e-aa343ea1c232",
                    "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
                    "Sprocket",
                    "Auto",
                    -1, 1, 0.785
                ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "b15b8fc2-cd05-4511-8810-f447c2cc69a1",
                        "c583ab7f-fd7d-4100-9c3e-aa343ea1c232",
                        "Move pre-pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "854c85ea-1010-4b17-ae1c-580bd2c0ef4d",
                        "c583ab7f-fd7d-4100-9c3e-aa343ea1c232",
                        "Move pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "37091772-f903-4064-b179-803c00c00499",
                        "c583ab7f-fd7d-4100-9c3e-aa343ea1c232",
                        "Move post-pick",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "c29e796e-2a66-4644-a14a-c9ca5098efac",
                        "c583ab7f-fd7d-4100-9c3e-aa343ea1c232",
                        "Move pre-place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "cc69bc98-4733-4e0b-9324-886932a3fd20",
                        "c583ab7f-fd7d-4100-9c3e-aa343ea1c232",
                        "Move place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "74b684ce-332b-4e07-8c34-7be7f44e8f86",
                        "c583ab7f-fd7d-4100-9c3e-aa343ea1c232",
                        "Move post-place",
                        "Queued"
                    ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "18b810fa-8c8a-4b94-be5a-84f3315d660b",
                        "c583ab7f-fd7d-4100-9c3e-aa343ea1c232",
                        "Home",
                        "Queued"
                    ).await;
            execute!(
                "INSERT OR IGNORE INTO locations (id, description, created_at) VALUES (?, ?, datetime('now'))",
                "ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d",
                "Apartment"
            ).await;
                execute!(
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at, x, z, theta) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?)",
                    "d544e656-0e8c-4c3d-91fc-02e38b326c47",
                    "ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d",
                    "House Bot 1",
                    "Auto",
                    -1, 0, 0
                ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "69c35b71-8715-4eff-bd02-82cfd283cbc8",
                        "d544e656-0e8c-4c3d-91fc-02e38b326c47",
                        "Random positions (continuous)",
                        "Queued"
                    ).await;
                execute!(
                    "INSERT OR IGNORE INTO robots (id, locationid, description, state, created_at, updated_at, x, z, theta) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?)",
                    "8e5cc95b-bb27-4150-adfa-2bab6daf313f",
                    "ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d",
                    "House Bot 2",
                    "Auto",
                    1, 0, 3.14
                ).await;
                    execute!(
                        "INSERT OR IGNORE INTO tasks (id, robotid, description, state, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
                        "7d77e2f1-8c58-4af4-9f04-0a39bcabb998",
                        "8e5cc95b-bb27-4150-adfa-2bab6daf313f",
                        "Random positions (continuous)",
                        "Queued"
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

        Mutation::CreateRobot { id, locationid, description , x, z, theta } => {
            log::debug!("appending robot({}): {}", id, description);
            execute!(
                "INSERT INTO robots (id, locationid, description, state, created_at, updated_at, x, z, theta)
                    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?)",
                id,
                locationid,
                description,
                "Off",
                x,
                z,
                theta
            ).await;
        }

        Mutation::DeleteRobot { id } => {
            execute!(
                "DELETE FROM robots WHERE id = ?", id
            ).await;
        }

        Mutation::UpdateRobotState { id, state } => {
            execute!(
                "UPDATE robots SET state = ?, updated_at = datetime('now') WHERE id = ?",
                state,
                id
            )
            .await;
        }

        Mutation::UpdateRobotPosition { id , x, z, theta } => {
            execute!(
                "UPDATE robots SET x = ?, z = ?, theta = ?, updated_at = datetime('now') WHERE id = ?",
                x,
                z,
                theta,
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
