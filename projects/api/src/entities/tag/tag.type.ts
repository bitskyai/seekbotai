import { systemShare } from "../../db/seedData/defaultUsers";
import { getSchemaBuilder } from "../gql-builder";

getSchemaBuilder().prismaObject("Tag", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    name: t.exposeString("name"),
    isSystem: t.boolean({ resolve: (tag) => tag.userId === systemShare.id }),
  }),
});
