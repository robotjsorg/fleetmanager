# Fleetmanager
Fleetmanager application for monitoring and controlling robot fleets.

Fleetmanager started out as a simple [SQLSync Wrapper](https://github.com/jmcmahon443/sqlsync-wrapper). These are instructions for wrapping [SQLSync](https://github.com/orbitinghail/sqlsync) by [orbitinghail](https://github.com/orbitinghail), and coincidentally for building Fleetmanager.

## Build SQLSync
* Clone SQLSync: `git clone https://github.com/orbitinghail/sqlsync`
* Run the commands below one at a time:
```
cd sqlsync
just build
just run-with-prefix 'wasm-'

cd sqlsync/lib/sqlsync-worker
pnpm install @rollup/plugin-node-resolve

cd sqlsync
just package-sqlsync-worker dev

cd sqlsync/demo/cloudflare-backend
pnpm i
```

## Build Fleetmanager
* Clone this repo alongside SQLSync: `git clone https://github.com/jmcmahon443/fleetmanager`
```
├── sqlsync/
└── fleetmanager/
```

### Local
* Deploy backend using `pnpm dev` from `sqlsync/demo/cloudflare-backend/`
* Build and upload reducer to local backend using `just upload-reducer` from `fleetmanager/`
* Build and deploy frontend using `pnpm i; pnpm dev` from `fleetmanager/frontend/`

### Remote
These are instructions for deploying to Cloudflare.

#### Backend
* Deploy backend using `npx wrangler deploy` from `sqlsync/demo/cloudflare-backend/`
* Upload reducer to remote backend using `just upload-reducer remote` from `fleetmanager/`

#### Frontend
* Build the frontend distribution using `npx vite build` from `fleetmanager/frontend/`
* Double check `.wasm` files are under 25MB (for example, should be 2MB compared to 60MB)
* Manually copy and paste GLTF files to `dist/`
* Manually upload `fleetmanager/frontend/dist/` to Cloudflare Pages
