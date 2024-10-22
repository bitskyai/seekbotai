import { getSchemaBuilder } from "../gql-builder";
import { DeleteIgnoreURLShape } from "./types";
import type { IgnoreURL } from "@prisma/client";

export const IgnoreURLBM = getSchemaBuilder()
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

export const DeleteIgnoreURLBM = getSchemaBuilder()
  .inputRef<DeleteIgnoreURLShape>("deleteIgnoreURLPayload")
  .implement({
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  });
