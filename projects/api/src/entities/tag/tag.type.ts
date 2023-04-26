import { systemShare } from "../../db/seedData/defaultUsers";
import { schemaBuilder } from "../gql-builder";

schemaBuilder.prismaObject("Tag", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    name: t.exposeString("name"),
    isSystem: t.boolean({ resolve: (tag) => tag.userId === systemShare.id }),
  }),
});
