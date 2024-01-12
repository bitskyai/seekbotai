import { startSearchEngine } from "./searchEngine";
import { startWebApp } from "./server";

// used for start server and search engine through docker container
async function start() {
  await startWebApp();
  await startSearchEngine();
}

start();
