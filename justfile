wasm-demo-reducer *FLAGS:
    cargo build --target wasm32-unknown-unknown --package demo-reducer {{FLAGS}}

# mode should be either debug or release
# target should be either local or remote
upload-demo-reducer mode='release':
    #!/usr/bin/env bash
    set -euo pipefail
    cd ../sqlsync/demo/cloudflare-backend
    just wasm-demo-reducer '--release'
    REDUCER_PATH="../../../fleetmanager/reducer/target/wasm32-unknown-unknown/release/reducer.wasm"
    echo "Uploading $REDUCER_PATH to localhost:8787"
    curl -X PUT --data-binary @$REDUCER_PATH http://localhost:8787/reducer