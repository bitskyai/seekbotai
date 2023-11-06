import pkg from "./package.json";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import renderer from "vite-plugin-electron-renderer";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        "@": path.join(__dirname, "ui"),
      },
    },
    build: {
      outDir: path.join(__dirname, "src/ui"),
    },
    plugins: [
      react(),
      // Use Node.js API in the Renderer-process
      renderer(),
    ],
    server:
      process.env.VSCODE_DEBUG &&
      (() => {
        const url = new URL(
          process.env.VITE_DEV_SERVER_URL ?? pkg.debug.env.VITE_DEV_SERVER_URL,
        );
        return {
          host: url.hostname,
          port: +url.port,
        };
      })(),
    clearScreen: false,
  };
});
