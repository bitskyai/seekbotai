import pkg from "./package.json";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, UserConfig } from "vite";
import renderer from "vite-plugin-electron-renderer";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config: UserConfig = {
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
    clearScreen: false,
  };

  if (command === "serve" && process.env.DESKTOP_VITE_DEV_SERVER_URL) {
    config.server = (() => {
      const url = new URL(process.env.DESKTOP_VITE_DEV_SERVER_URL);
      return {
        host: url.hostname,
        port: +url.port,
      };
    })();
  }
  return config;
});
