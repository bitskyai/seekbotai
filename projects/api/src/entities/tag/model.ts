import { builder } from "../../builder";

builder.prismaObject("Tag", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    name: t.exposeString("name"),
    isSystem: 
  }),
});
