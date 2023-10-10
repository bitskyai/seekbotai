import { schemaBuilder } from "../gql-builder";
import type { QueryPreference } from "./types";

export const IgnoreURLBM = schemaBuilder.prismaObject("IgnoreURL", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    pattern: t.exposeString("pattern"),
    regularExpression: t.exposeBoolean("regularExpression"),
  }),
});

export const QueryPreferenceBM = schemaBuilder
  .objectRef<QueryPreference>("QueryPreference")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id", { nullable: true }),
      createdAt: t.expose("createdAt", { type: "DateTime", nullable: true }),
      updatedAt: t.expose("updatedAt", { type: "DateTime", nullable: true }),
      apiKey: t.exposeString("apiKey", { nullable: true }),
      logLevel: t.exposeString("logLevel", { nullable: true }),
      logSize: t.expose("logSize", { type: "Int", nullable: true }),
      indexFrequency: t.expose("indexFrequency", {
        type: "Int",
        nullable: true,
      }),
      ignoreURLs: t.expose("ignoreURLs", {
        type: [IgnoreURLBM],
        nullable: true,
      }),
    }),
  });
