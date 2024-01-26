import { getSchemaBuilder } from "../gql-builder";
import { IgnoreURLBM } from "../ignoreURL/schema.type";
import { PreferenceBM } from "../preference/schema.type";
import { UserShape } from "./type";

export const UserBM = getSchemaBuilder()
  .objectRef<UserShape>("User")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      createdAt: t.expose("createdAt", { type: "DateTime" }),
      updatedAt: t.expose("updatedAt", { type: "DateTime" }),
      email: t.exposeString("email", { nullable: true }),
      username: t.exposeString("username"),
      preference: t.expose("preference", {
        type: PreferenceBM,
        nullable: true,
      }),
      ignoreURLs: t.expose("ignoreURLs", {
        type: [IgnoreURLBM],
        nullable: true,
      }),
    }),
  });
