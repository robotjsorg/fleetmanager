# Fleetmanager
Fleetmanager application for monitoring and controlling robot fleets.

Fleetmanager started out as a simple [SQLSync Wrapper](https://github.com/jmcmahon443/sqlsync-wrapper). These are instructions for wrapping [SQLSync](https://github.com/orbitinghail/sqlsync) by [orbitinghail](https://github.com/orbitinghail), and coincidentally for building Fleetmanager.

## TODO
Make sure all languages build tools are on latest version: rustc, clang, gcc, cargo, npx, wrangler, nodejs, npm. List any other required build tools. Include instructions to install required build tools, and include minimum version in devDependencies.

## Build SQLSync
* Clone SQLSync: `git clone https://github.com/orbitinghail/sqlsync`
* Run the commands below one at a time:
```
cd sqlsync
just build
just run-with-prefix 'wasm-'

cd sqlsync/lib/sqlsync-worker
pnpm install @rollup/plugin-node-resolve // need to double check if this is still required

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
* Build and deploy frontend using `pnpm i; pnpm dev --host` from `fleetmanager/frontend/`

### Remote
These are instructions for deploying to Cloudflare.

#### Backend
* Deploy backend using `npx wrangler deploy` from `sqlsync/demo/cloudflare-backend/`
* Upload reducer to remote backend using `just upload-reducer remote` from `fleetmanager/`

#### Frontend
* Build the frontend distribution using `npx vite build` from `fleetmanager/frontend/`
<!-- * Copy favicon and GLTF files using `just prep-frontend` from `fleetmanager/` -->
* Double check `.wasm`, `.gltf`, `.glb`, `.jpg` and `.png` files are under 25MB (for example, should be 2MB compared to 60MB)
* Manually copy and paste Favicon and GLTF folders to `dist/`
* Deploy the frontend to Cloudflare using `npx wrangler pages deploy dist` from `fleetmanager/frontend/`
<!-- * Manually upload `fleetmanager/frontend/dist/` to Cloudflare Pages -->
