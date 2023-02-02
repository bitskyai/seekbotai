import { mergeSchema } from "~background/helpers/utils";

import BaseSchema from "./base.schema";

const FilterSchema = mergeSchema(BaseSchema, {
  title: "filter schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    content: {
      type: "string"
    }
  },
  required: ["content"]
});

export default FilterSchema;
