import { mergeSchema } from "~background/helpers/utils";

import BaseSchema from "./base.schema";

const BookmarkSchema = mergeSchema(BaseSchema, {
  title: "bookmark schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    url: {
      type: "string",
      format: "url",
      maxLength: 2048
    },
    tags: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "string"
      }
    },
    name: {
      type: "string"
    },
    description: {
      type: "string"
    },
    favorite: {
      type: "boolean"
    },
    local_only: {
      type: "boolean"
    }
  },
  required: ["url", "name"]
});

export default BookmarkSchema;
