import { mergeSchema } from "~background/helpers/utils";

import BaseSchema from "./base.schema";

const PageAssetSchema = mergeSchema(BaseSchema, {
  title: "page asset schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    content: {
      type: "string"
    },
    bookmark_id: {
      type: "string",
      format: "uuid"
    },
    type: {
      type: "string",
      enum: ["img"]
    }
  },
  required: ["bookmark_id", "content", "type"]
});

export default PageAssetSchema;
