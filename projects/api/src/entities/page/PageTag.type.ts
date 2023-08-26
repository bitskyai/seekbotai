import { schemaBuilder } from "../gql-builder";

schemaBuilder.prismaObject("PageTag", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    tag: t.relation("tag"),
  }),
});
