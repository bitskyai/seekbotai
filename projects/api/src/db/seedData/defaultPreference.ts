import { DEFAULT_MEILISEARCH_MASTER_KEY } from "../../bitskyLibs/shared";
import { defaultUser } from "./defaultUsers";

export const defaultPreference = {
  id: "9e275c34-a565-41af-b84d-a6edc2ce7457",
  logLevel: "info",
  logSize: 50 * 1024 * 1024, // 50MB
  indexFrequency: 60 * 5, // 5 minutes
  apiKey: DEFAULT_MEILISEARCH_MASTER_KEY,
  userId: defaultUser.id,
};
