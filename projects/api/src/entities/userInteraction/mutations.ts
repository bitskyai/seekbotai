import { emitSearch } from "../../event";
import { GQLContext } from "../../types";
import type { MutationResShape } from "../common.type";
import { MutationResShapeBM } from "../common.type";
import { getSchemaBuilder } from "../gql-builder";
import { UserInteractionPayloadBM } from "./schema.type";
import type { SearchDataType, UserInteraction } from "./type";
import { UserInteractionType } from "./type";

getSchemaBuilder().mutationField("userInteraction", (t) =>
  t.field({
    type: MutationResShapeBM,
    args: {
      userInteraction: t.arg({
        type: UserInteractionPayloadBM,
        required: true,
      }),
    },
    resolve: async (root, args, ctx) => {
      if (
        args.userInteraction.type.toLocaleLowerCase() ===
        UserInteractionType.SEARCH.toLocaleLowerCase()
      ) {
        const data = args.userInteraction.data as SearchDataType;
        if (data?.query?.length > 0) {
          console.log("Emitting search event", data);
          emitSearch(args.userInteraction.data);
        }
      }
      const res = await recordUserInteraction({
        ctx,
        userInteraction: args.userInteraction,
      });
      return res;
    },
  }),
);

export async function recordUserInteraction({
  ctx,
  userInteraction,
}: {
  ctx: GQLContext;
  userInteraction: UserInteraction;
}): Promise<MutationResShape> {
  // TODO: Implement recording user interaction in the database
  console.debug("Recording user interaction", userInteraction);
  return {
    success: true,
    message: "",
  };
}
