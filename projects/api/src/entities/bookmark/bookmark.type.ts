import { schemaBuilder } from "../gql-builder";

schemaBuilder.prismaObject("Bookmark", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    name: t.exposeString("name"),
    description: t.exposeString("description", { nullable: true }),
    icon: t.exposeString("icon", { nullable: true }),
    url: t.exposeString("url"),
    favorite: t.exposeBoolean("favorite"),
    bookmarkTags: t.relation("bookmarkTags"),
  }),
});
