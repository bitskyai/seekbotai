import { getPrismaClient } from "../../db";
import { GQLContext } from "../../types";
import { type MutationResShape, MutationResShapeBM } from "../common.type";
import { getSchemaBuilder } from "../gql-builder";
import { DeleteIgnoreURLBM } from "./schema.type";
import { DeleteIgnoreURLShape } from "./types";

getSchemaBuilder().mutationField("deleteIgnoreURLs", (t) =>
  t.field({
    type: MutationResShapeBM,
    args: {
      deleteIgnoreURLs: t.arg({ type: [DeleteIgnoreURLBM], required: true }),
    },
    resolve: async (parent, args, ctx) => {
      return deleteIgnoreURLs({ ctx, deleteIgnoreURLs: args.deleteIgnoreURLs });
    },
  }),
);

export async function deleteIgnoreURLs({
  ctx,
  deleteIgnoreURLs,
}: {
  ctx: GQLContext;
  deleteIgnoreURLs: DeleteIgnoreURLShape[];
}): Promise<MutationResShape> {
  const prisma = getPrismaClient();
  await prisma.ignoreURL.deleteMany({
    where: {
      userId: ctx.user.id,
      id: {
        in: deleteIgnoreURLs.map((d) => d.id),
      },
    },
  });
  return {
    success: true,
    message: "",
  };
}
