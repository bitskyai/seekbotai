import { getPrismaClient } from "../../db";
import { GQLContext } from "../../types";
import { getSchemaBuilder } from "../gql-builder";
import { getIgnoreURLs } from "../ignoreURL/ignoreURL.query";
import { getPreference } from "../preference/preference.query";
import { UserBM } from "./schema.type";
import { UserShape } from "./type";

getSchemaBuilder().queryField("user", (t) =>
  t.field({
    type: UserBM,
    resolve: async (parent, args, ctx) => {
      return getUser({ ctx });
    },
  }),
);

export async function getUser({ ctx }: { ctx: GQLContext }) {
  const prisma = getPrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      id: ctx.user.id,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const preference = await getPreference({ ctx });
  const ignoreURLs = await getIgnoreURLs({ ctx });
  const newUser: UserShape = { ...user, preference, ignoreURLs };
  return newUser;
}
