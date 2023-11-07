# Fleetmanager
This is a homemade, open-source Fleetmanager application, for monitoring and controlling warehouse and factory robots.

## SQLSync Wrapper
The backend is made using SQLSync. These are instructions for wrapping SQLSync, so that a custom reducer and frontend may easily be created. That way, when SQLSync updates in the future, this Fleetmanager wrapper does not have to change.

### Build
  * Clone SQLSync: `git clone https://github.com/orbitinghail/sqlsync`
  * Follow the SQLSync Build instructions below
  * Clone this repo alongside SQLSync: `git clone TODO`
  * Update `main.tsx`
  * Update `justfile`
  

### Local
  * Deploy backend using `pnpm dev` from `sqlsync/demo/cloudflare_backend`: `cd path/to/sqlsync/demo/cloudflare_backend && pnpm dev`
  * Build reducer using `just wasm-reducer` from `fleetmanager`: `cd fleetmanager && just wasm-reducer` Equivalent of: `cd reducer && cargo build --target wasm32-unknown-unknown --package reducer '--release'`
  * Upload reducer using `just upload-reducer` to backend from `fleetmanager`: `cd fleetmanager && just upload-reducer`
  * Deploy frontend using `pnpm i; pnpm dev` from `fleetmanager/frontend`: `cd fleetmanager/frontend && pnpm i; pnpm dev`

### Remote
  * Manually update `name` and `bucket_name` in `wrangler.toml` in `sqlsync/demo/cloudflare_backend/` to match the intended Cloudflare Worker name and R2 Bucket name.
  * Manually update `SQLSYNC_PROD_URL` in `justfile` in `fleetmanager/` to intended Cloudflare Worker URL
  * Deploy backend using `npx wrangler deploy` from `sqlsync/demo/cloudflare_backend`: `cd path/to/sqlsync/demo/cloudflare_backend && npx wrangler deploy`
  * Deploy reducer using `just upload-reducer remote` from `fleetmanager`: `cd path/to/fleetmanager && just upload-reducer remote`
  * `cd demo/frontend`
  * Update `COORDINATOR_URL` in `main.tsx` in `fleetmanager/demo/frontend/` to intended Cloudflare Worker URL
  * `npx vite build`
  * Double check .wasm files are under 25MB (for example, should be 2MB compared to 60MB)
  * Manually upload to Cloudflare Pages

### TODO
  * Install remote packages `cd path/to/fleetmanager/front && pnpm add @orbitinghail/sqlsync-react @orbitinghail/sqlsync-worker`

## SQLSync Build
### Clean up and rebuild wasm artifacts
* Manually delete ALL node_modules folders in /demo/frontend, /demo/cloudflare_backend, /lib/sqlsync-worker, 
* `cd lib/sqlsync-worker`
* `pnpm install @rollup/plugin-node-resolve`
* `cd sqlsyncfleetmanager`
* `rustup target add wasm32-unknown-unknown`
* `just build`
* `just run-with-prefix 'wasm-'`
* `just wasm-demo-reducer --release`
* `just package-sqlsync-worker dev`

### Local
#### Server
* Update the justfile command upload-demo-reducer so that it targets local instead of remote: target=‘local’
* `cd demo/cloudflare-backend`
* `pnpm i`
* `pnpm dev`

#### Reducer
* `cd sqlsyncfleetmanager`
* `just upload-demo-reducer release local`

#### Frontend
* `cd demo/frontend`
* Update COORDINATOR_URL in main.tsx to: localhost:8787
* `pnpm i`
* `pnpm dev`

### Remote
#### Server
* Update the justfile command upload-demo-reducer so that it targets remote instead of local: target=‘remote’
* `cd demo/cloudflare-backend`
* `npx wrangler deploy`

#### Reducer
* `just upload-demo-reducer release remote`

#### Frontend
* `cd lib/sqlsync-worker`
* `pnpm build-release`
* `cd demo/frontend`
* Update COORDINATOR_URL in main.tsx to: api.robotjs.org
* `npx vite build`
* Double check .wasm files are under 25MB (for example, should be 2MB compared to 60MB)
* Manually copy and paste GLTF files to `/dist`
* Manually upload to Cloudflare pages