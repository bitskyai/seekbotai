import { getSchemaBuilder } from "../gql-builder";
import { UserInteraction } from "./type";

export const UserInteractionPayloadBM = getSchemaBuilder()
  .inputRef<UserInteraction>("UserInteractionPayload")
  .implement({
    fields: (t) => ({
      type: t.string({ required: true }),
      data: t.field({ type: "JSON", required: true }),
    }),
  });
