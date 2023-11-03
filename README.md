# Instructions
  * Clone SQLSync `git clone https://github.com/orbitinghail/sqlsync` and then this repo next to it.
  * Deploy backend from `sqlsync/demo/cloudflare_backend`: `pnpm dev`.
  * Build and upload reducer to background from `fleetmanager`: `just upload-demo-reducer`.
  * Deploy frontend from `fleetmanager/frontend`: `pnpm i; pnpm dev`