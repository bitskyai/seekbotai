import { mergeSchema } from "~background/helpers/utils";

import BaseSchema from "./base.schema";

const TagSchema = mergeSchema(BaseSchema, {
  title: "tag schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    isSystem: {
      type: "boolean",
      default: false
    },
    local_only: {
      type: "boolean",
      default: false
    }
  },
  required: ["name", "isSystem", "local_only"]
});

export default TagSchema;
