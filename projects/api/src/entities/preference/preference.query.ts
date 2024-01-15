import { getPrismaClient } from "../../db";
import { GQLContext } from "../../types";
import { getSchemaBuilder } from "../gql-builder";
import { PreferenceBM } from "./schema.type";

getSchemaBuilder().queryField("preference", (t) =>
  t.field({
    type: PreferenceBM,
    resolve: async (parent, args, ctx) => {
      return getPreference({ ctx });
    },
  }),
);

export async function getPreference({ ctx }: { ctx: GQLContext }) {
  const prisma = getPrismaClient();
  const preference = await prisma.preference.findFirst({
    where: {
      userId: ctx.user.id,
    },
  });
  if (!preference) {
    throw new Error("Preference not found");
  }
  return preference;
}
