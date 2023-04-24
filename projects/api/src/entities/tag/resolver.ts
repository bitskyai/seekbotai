import { builder } from "../../builder";
// import { getTags } from "./graphql.api";
import { getPrismaClient } from "../../db";
import "./model";

export default async () => {
  builder.queryField("tags", (t) =>
    t.prismaField({
      type: ["Tag"],
      resolve: async (query, root, args, ctx, info) => {
        // return getTags(query, root, args, ctx);

        const prismaClient = getPrismaClient();
        return prismaClient.tag.findMany({
          where: { userId: ctx.user.id },
        });
      },
    }),
  );
};
