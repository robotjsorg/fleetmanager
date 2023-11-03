# Instructions
  * Clone SQLSync `git clone https://github.com/orbitinghail/sqlsync` and then this repo next to it.
  * Deploy backend from `sqlsync/demo/cloudflare_backend`: `pnpm dev`.
  * Build reducer from `fleetmanager`: `just wasm-reducer`. Equivalent of `cd reducer && cargo build --target wasm32-unknown-unknown --package reducer '--release'`.
  * Upload reducer to backend from `fleetmanager`: `just upload-reducer`.
  * Deploy frontend from `fleetmanager/frontend`: `pnpm i; pnpm dev`


  pnpm add @orbitinghail/sqlsync-react @orbitinghail/sqlsync-worker   
