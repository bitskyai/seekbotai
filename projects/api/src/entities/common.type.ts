import { schemaBuilder } from "./gql-builder";

export const SortOrder = schemaBuilder.enumType("SortOrder", {
  values: ["asc", "desc"] as const,
});
