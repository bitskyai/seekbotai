import { builder } from "../gql-builder";

builder.prismaObject("Tag", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    name: t.exposeString("name"),
    // isSystem: t.boolean({resolve:(parent)=>parent?.isSystem})
  }),
});
