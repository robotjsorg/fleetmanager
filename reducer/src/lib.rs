// build: "cargo build --target wasm32-unknown-unknown -p reducer --release"

use serde::Deserialize;
use sqlsync_reducer::{execute, init_reducer, types::ReducerError};

#[derive(Deserialize, Debug)]
#[serde(tag = "tag")]
enum Mutation {
    InitSchema,

    PopulateLocations,

    PopulateRobots,

    PopulateTasks,

    CreateLocation {
        id: String,
        description: String,
    },

    DeleteLocation {
        id: String,
    },

    CreateRobot {
        id: String,
        locationid: String,
        description: String,
        x: f32,
        z: f32,
        theta: f32,
    },

    DeleteRobot {
        id: String,
    },

    UpdateRobotState {
        id: String,
        state: String,
    },

    UpdateRobotPosition {
        id: String,
        x: f32,
        z: f32,
        theta: f32,
    },

    CreateTask {
        id: String,
        robotid: String,
        description: String,
    },

    DeleteTask {
        id: String,
    },

    UpdateTask {
        id: String,
        state: String,
    },
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
            .await?;
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
            .await?;
            execute!(
                "CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    robotid TEXT NOT NULL,
                    description TEXT NOT NULL,
                    state TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )"
            )
            .await?;
        }

        Mutation::PopulateLocations => {
            execute!(
                "
                INSERT
                INTO locations (id, description, created_at)
                SELECT 'c0f67f5f-3414-4e50-9ea7-9ae053aa1f99', 'Warehouse', datetime('now')
                WHERE NOT EXISTS (SELECT 1 FROM locations)
                UNION
                SELECT 'ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d', 'Apartment', datetime('now')
                WHERE NOT EXISTS (SELECT 1 FROM locations)
            "
            )
            .await?;
        }

        Mutation::PopulateRobots => {
            execute!("
                INSERT
                INTO robots (id, locationid, description, state, created_at, updated_at, x, z, theta)
                SELECT '24db4c5b-1e3a-4853-8316-1d6ad07beed1', 'c0f67f5f-3414-4e50-9ea7-9ae053aa1f99', 'Rusty', 'Auto', datetime('now'), datetime('now'), 1.0, 1.0, 2.355
                WHERE NOT EXISTS (SELECT 1 FROM robots)
                UNION
                SELECT '402e7545-512b-4b7d-b570-e94311b38ab6', 'c0f67f5f-3414-4e50-9ea7-9ae053aa1f99', 'D.A.R.Y.L.', 'Auto', datetime('now'), datetime('now'), 1, -1, -2.355
                WHERE NOT EXISTS (SELECT 1 FROM robots)
                UNION
                SELECT 'f7a3408d-6329-47fd-ada9-72e6f249c3e2', 'c0f67f5f-3414-4e50-9ea7-9ae053aa1f99', 'Nozzle', 'Auto', datetime('now'), datetime('now'), -1, -1, -0.785
                WHERE NOT EXISTS (SELECT 1 FROM robots)
                UNION
                SELECT 'c583ab7f-fd7d-4100-9c3e-aa343ea1c232', 'c0f67f5f-3414-4e50-9ea7-9ae053aa1f99', 'Sprocket', 'Auto', datetime('now'), datetime('now'), -1, 1, 0.785
                WHERE NOT EXISTS (SELECT 1 FROM robots)
                UNION
                SELECT 'd544e656-0e8c-4c3d-91fc-02e38b326c47', 'ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d', 'House Bot 1', 'Auto', datetime('now'), datetime('now'), -1, 0, 0
                WHERE NOT EXISTS (SELECT 1 FROM robots)
                UNION
                SELECT '8e5cc95b-bb27-4150-adfa-2bab6daf313f', 'ff96decd-dd89-46ee-b6c9-8c5bbbb34d2d', 'House Bot 2', 'Auto', datetime('now'), datetime('now'), 1, 0, 3.14
                WHERE NOT EXISTS (SELECT 1 FROM robots)
            ").await?;
        }

        Mutation::PopulateTasks => {
            execute!("
                INSERT OR IGNORE
                INTO tasks (id, robotid, description, state, created_at)
                SELECT '48228b08-1b8a-4d54-9b90-16f1f73fb1cc', '24db4c5b-1e3a-4853-8316-1d6ad07beed1', 'Pick and place (continuous)', 'Queued', datetime('now')
                UNION
                SELECT 'ea131ae6-13a8-4a23-9436-5f46f3dcffd1', '402e7545-512b-4b7d-b570-e94311b38ab6', 'Pick and place (continuous)', 'Queued', datetime('now')
                UNION
                SELECT '720187e4-94f4-4a11-b998-5938554a2fb4', 'f7a3408d-6329-47fd-ada9-72e6f249c3e2', 'Pick and place (continuous)', 'Queued', datetime('now')
                UNION
                SELECT 'b15b8fc2-cd05-4511-8810-f447c2cc69a1', 'c583ab7f-fd7d-4100-9c3e-aa343ea1c232', 'Pick and place (continuous)', 'Queued', datetime('now')
                UNION
                SELECT '69c35b71-8715-4eff-bd02-82cfd283cbc8', 'd544e656-0e8c-4c3d-91fc-02e38b326c47', 'Random position (continuous)', 'Queued', datetime('now')
                UNION
                SELECT '7d77e2f1-8c58-4af4-9f04-0a39bcabb998', '8e5cc95b-bb27-4150-adfa-2bab6daf313f', 'Random position (continuous)', 'Queued', datetime('now')
            ").await?;
        }

        Mutation::CreateLocation { id, description } => {
            log::debug!("appending location({}): {}", id, description);
            execute!(
                "INSERT INTO locations (id, description, created_at)
                    VALUES (?, ?, datetime('now'))",
                id,
                description
            )
            .await?;
        }

        Mutation::DeleteLocation { id } => {
            execute!("DELETE FROM locations WHERE id = ?", id).await?;
        }

        Mutation::CreateRobot {
            id,
            locationid,
            description,
            x,
            z,
            theta,
        } => {
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
            ).await?;
        }

        Mutation::DeleteRobot { id } => {
            execute!("DELETE FROM robots WHERE id = ?", id).await?;
        }

        Mutation::UpdateRobotState { id, state } => {
            execute!(
                "UPDATE robots SET state = ?, updated_at = datetime('now') WHERE id = ?",
                state,
                id
            )
            .await?;
        }

        Mutation::UpdateRobotPosition { id, x, z, theta } => {
            execute!(
                "UPDATE robots SET x = ?, z = ?, theta = ?, updated_at = datetime('now') WHERE id = ?",
                x,
                z,
                theta,
                id
            )
            .await?;
        }

        Mutation::CreateTask {
            id,
            robotid,
            description,
        } => {
            log::debug!(
                "appending task({}) to robot({}): {}",
                id,
                robotid,
                description
            );
            execute!(
                "INSERT INTO tasks (id, robotid, description, state, created_at)
                    VALUES (?, ?, ?, ?, datetime('now'))",
                id,
                robotid,
                description,
                "Queued"
            )
            .await?;
        }

        Mutation::DeleteTask { id } => {
            execute!("DELETE FROM tasks WHERE id = ?", id).await?;
        }

        Mutation::UpdateTask { id, state } => {
            execute!("UPDATE tasks SET state = ? WHERE id = ?", state, id).await?;
        }
    }

    Ok(())
}
