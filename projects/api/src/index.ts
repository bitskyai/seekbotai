import { startSearchEngine, stopSearchEngine } from "./searchEngine";
import { startServer, stopServer } from "./server";

export * from "./types";

export async function startWebApp() {
  await startServer();
}
