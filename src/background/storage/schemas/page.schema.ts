import { mergeSchema } from "~background/helpers/utils";

import BaseSchema from "./base.schema";

const PageSchema = mergeSchema(BaseSchema, {
  title: "page schema",
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
    }
  },
  required: ["bookmark_id", "content"]
});

export default PageSchema;
