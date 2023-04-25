import { builder } from "../gql-builder";
import { getTags } from "./graphql.api";

builder.queryField("tags", (t) =>
  t.prismaField({
    type: ["Tag"],
    resolve: async (query, root, args, ctx, info) => {
      return getTags(ctx);
    },
  }),
);
