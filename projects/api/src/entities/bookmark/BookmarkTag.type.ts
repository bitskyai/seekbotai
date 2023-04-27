import { schemaBuilder } from "../gql-builder";

schemaBuilder.prismaObject("BookmarkTag", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    tag: t.relation("tag"),
  }),
});
