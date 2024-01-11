SQLSYNC_PROD_URL := "https://api.robotjs.org"

wasm-reducer:
    #!/usr/bin/env bash
    echo "[INFO] Building reducer"
    cd reducer && cargo build --target wasm32-unknown-unknown --package reducer '--release'

upload-reducer target='local':
    #!/usr/bin/env bash
    just wasm-reducer
    set -euo pipefail
    REDUCER_PATH="reducer/target/wasm32-unknown-unknown/release/reducer.wasm"
    
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
    # TODO: copy and paste ./frontend/dist/index.html L15-16 to ./frontend/dist/assets/index.html L17-18
    # line15=sed -n 15p ./frontend/dist/index.html
    # line16=sed -n 16p ./frontend/dist/index.html
    # sed -i '17i sed -n 15p ./frontend/dist/index.html' ./frontend/dist/assets/index.html
    # sed -i '18i sed -n 16p ./frontend/dist/index.html' ./frontend/dist/assets/index.html
    cp -f ./frontend/dist/assets/index.html ./frontend/dist/