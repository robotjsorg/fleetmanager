SQLSYNC_PROD_URL := "https://api.robotjs.org"

wasm-reducer:
    #!/usr/bin/env bash
    echo "[INFO] Building reducer"
    cd reducer && cargo build --target wasm32-unknown-unknown --package reducer '--release'

upload-reducer target='local':
    #!/usr/bin/env bash
    just wasm-reducer
    set -euo pipefail
    cd ../sqlsync/demo/cloudflare-backend
    REDUCER_PATH="../../../fleetmanager/reducer/target/wasm32-unknown-unknown/release/reducer.wasm"
    
    if [[ '{{target}}' = 'remote' ]]; then
        echo "[INFO] Uploading $REDUCER_PATH to {SQLSYNC_PROD_URL}}"
        curl -X PUT --data-binary @$REDUCER_PATH {{SQLSYNC_PROD_URL}}/reducer
    else
        echo "[INFO] Uploading $REDUCER_PATH to localhost:8787"
        curl -X PUT --data-binary @$REDUCER_PATH http://localhost:8787/reducer
    fi

prep-frontend:
    cp -r ./frontend/assets/gltf/ ./frontend/dist/
    cp -r ./frontend/assets/favicon/ ./frontend/dist/
    cp -f ./frontend/assets/index.html ./frontend/dist/
    # remember to copy and paste lines 15 & 16 from ./frontend/assets/dist/index.html