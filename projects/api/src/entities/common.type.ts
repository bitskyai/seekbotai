import { schemaBuilder } from "./gql-builder";

export type MutationResShape = {
  success: boolean;
  message?: string;
};

export const SortOrder = schemaBuilder.enumType("SortOrder", {
  values: ["asc", "desc"] as const,
});

export const MutationResShapeBM = schemaBuilder
  .objectRef<MutationResShape>("MutationRes")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success", { nullable: false }),
      message: t.exposeString("message", { nullable: true }),
    }),
  });
