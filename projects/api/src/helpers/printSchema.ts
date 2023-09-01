import { getAppConfig } from "./config";
import getLogger from "./logger";
import { writeFileSync } from "fs";
import {
  printSchema,
  lexicographicSortSchema,
  type GraphQLSchema,
} from "graphql";
import path from "path";

export default function printGraphqlSchema(schema: GraphQLSchema) {
  const config = getAppConfig();
  const logger = getLogger();
  if (config.LOG_LEVEL === "debug") {
    const schemaPath = path.join(config.APP_HOME_PATH, "schema.graphql");
    logger.debug(`[printGraphqlSchema] schemaPath: ${schemaPath}`);
    const schemaAsString = printSchema(lexicographicSortSchema(schema));
    writeFileSync(schemaPath, schemaAsString);
  }
}
