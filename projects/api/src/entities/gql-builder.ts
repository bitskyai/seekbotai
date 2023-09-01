import { getPrismaClient } from "../db";
import { GQLContext } from "../types";
import { SearchResultPage } from "./page/types";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects";
import {
  DateResolver,
  DateTimeResolver,
  URLResolver,
  UUIDResolver,
} from "graphql-scalars";

export const schemaBuilder = new SchemaBuilder<{
  Objects: {
    SearchResultPage: SearchResultPage;
  };
  Scalars: {
    Date: { Input: Date; Output: Date };
    DateTime: { Input: Date; Output: Date };
    URL: { Input: string; Output: string };
    UUID: { Input: string; Output: string };
  };
  PrismaTypes: PrismaTypes;
  Context: GQLContext;
}>({
  plugins: [PrismaPlugin, SimpleObjectsPlugin],
  prisma: {
    client: getPrismaClient(),
    filterConnectionTotalCount: true,
  },
});

schemaBuilder.addScalarType("Date", DateResolver, {});
schemaBuilder.addScalarType("DateTime", DateTimeResolver, {});
schemaBuilder.addScalarType("URL", URLResolver, {});
schemaBuilder.addScalarType("UUID", UUIDResolver, {});

// We create empty root query, mutation, and subscription
// because we'll define individual nodes in other files
// since those nodes can have multiple resolvers and possibly
// can lead to really large and hard to read/navigate files
schemaBuilder.queryType({});
schemaBuilder.mutationType({});
// schemaBuilder.subscriptionType({});
