const BaseSchema = {
  title: "base schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      maxLength: 200
    },
    created_at: {
      type: "string",
      format: "date-time"
    },
    updated_at: {
      type: "string",
      format: "date-time"
    },
    last_synced: {
      type: "string",
      format: "date-time"
    }
  },
  required: ["id", "created_at", "updated_at"]
};

export default BaseSchema;
