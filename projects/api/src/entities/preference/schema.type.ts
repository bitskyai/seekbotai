import { schemaBuilder } from "../gql-builder";

export const PreferenceBM = schemaBuilder.prismaObject("Preference", {
  fields: (t) => ({
    id: t.exposeID("id"),
    apiKey: t.exposeString("apiKey"),
    logLevel: t.exposeString("logLevel"),
    logSize: t.exposeInt("logSize"),
    indexFrequency: t.exposeInt("indexFrequency"),
  }),
});
