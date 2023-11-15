import dotenv from "dotenv";
import { ensureFileSync } from "fs-extra";
import path from "node:path";

export default function loadEnv() {
  const envFilePath = path.join(__dirname, "../../.env");
  ensureFileSync(envFilePath);
  dotenv.config({
    path: envFilePath,
  });
}

loadEnv();
