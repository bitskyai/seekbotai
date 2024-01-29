import dotenv from "dotenv";
import { pathExistsSync } from "fs-extra";
import path from "node:path";

export default function loadEnv() {
  const envFilePath = path.join(__dirname, "../../.env");
  if (pathExistsSync(envFilePath)) {
    dotenv.config({
      path: envFilePath,
    });
  }
}

loadEnv();
