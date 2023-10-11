import { schemaBuilder } from "../gql-builder";
import type { IgnoreURL } from "@prisma/client";

export const IgnoreURLBM = schemaBuilder
  .objectRef<IgnoreURL>("ignoreURL")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      createdAt: t.expose("createdAt", { type: "DateTime" }),
      updatedAt: t.expose("updatedAt", { type: "DateTime" }),
      pattern: t.exposeString("pattern"),
      regularExpression: t.exposeBoolean("regularExpression"),
    }),
  });
