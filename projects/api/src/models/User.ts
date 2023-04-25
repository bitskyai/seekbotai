import { getPrismaClient } from "../db";
import { builder } from "../entities/gql-builder";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    username: t.exposeString("username"),
  }),
});

builder.queryField("users", (t) =>
  t.prismaField({
    type: ["User"],
    resolve: async (query, root, args, ctx, info) => {
      return getPrismaClient().user.findMany({ ...query });
    },
  }),
);
