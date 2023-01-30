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
    },
    url: {
      type: "string",
      format: "url",
      maxLength: 2048
    }
  },
  required: ["bookmark_id", "content", "url"]
});

export default PageSchema;
