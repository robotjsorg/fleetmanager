import react from "@vitejs/plugin-react";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        "../../reducer/target/wasm32-unknown-unknown/debug/reducer.wasm",
        "../../reducer/target/wasm32-unknown-unknown/release/reducer.wasm"
      ]
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        build: resolve(__dirname, 'assets/index.html'),
        dist: resolve(__dirname, 'assets/index.html')
      }
    }
  }
});