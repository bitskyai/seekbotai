import { getPrismaClient } from "../db";
import { GQLContext } from "../types";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { DateResolver, DateTimeResolver } from "graphql-scalars";

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
    DateTime: { Input: Date; Output: Date };
  };
  PrismaTypes: PrismaTypes;
  Context: GQLContext;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: getPrismaClient(),
    filterConnectionTotalCount: true,
  },
});

builder.addScalarType("Date", DateResolver, {});
builder.addScalarType("DateTime", DateTimeResolver, {});

// We create empty root query, mutation, and subscription
// because we'll define individual nodes in other files
// since those nodes can have multiple resolvers and possibly
// can lead to really large and hard to read/navigate files
builder.queryType({});
// builder.mutationType({});
// builder.subscriptionType({});
