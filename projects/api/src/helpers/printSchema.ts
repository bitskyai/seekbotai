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
  if (
    config.WEB_APP_LOG_LEVEL === "debug" &&
    config.NODE_ENV?.toLocaleLowerCase() !== "production"
  ) {
    const schemaPath = path.join(config.WEB_APP_HOME_PATH, "schema.graphql");
    logger.debug(`[printGraphqlSchema] schemaPath: ${schemaPath}`);
    const schemaAsString = printSchema(lexicographicSortSchema(schema));
    writeFileSync(schemaPath, schemaAsString);
  }
}
