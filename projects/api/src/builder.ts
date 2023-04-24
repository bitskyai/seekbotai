import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { DateResolver, DateTimeResolver } from "graphql-scalars";
import { getPrismaClient } from "./db";

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
    DateTime: { Input: Date; Output: Date };
  };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: getPrismaClient(),
    filterConnectionTotalCount: true,
  },
});

builder.addScalarType("Date", DateResolver, {});
builder.addScalarType("DateTime", DateTimeResolver, {});

builder.queryType({});
