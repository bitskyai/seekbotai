import { startSearchEngine } from "./searchEngine";
import { startServer } from "./server";

// used for start server and search engine through docker container
async function start() {
  await startServer();
  await startSearchEngine();
}

start();
