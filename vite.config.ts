import react from "@vitejs/plugin-react";
import { defineConfig, searchForWorkspaceRoot } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.gltf'],
  plugins: [react()],
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        "../../target/wasm32-unknown-unknown/debug/demo_reducer.wasm",
        "../../target/wasm32-unknown-unknown/release/demo_reducer.wasm",
        "./abb_irb52_7_120.gltf" // might not need this, is there a way to pass this file thru the compression?
      ],
    },
  },
});
