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
  JSONResolver,
  URLResolver,
  UUIDResolver,
} from "graphql-scalars";

let _schemaBuilder:
  | PothosSchemaTypes.SchemaBuilder<
      PothosSchemaTypes.ExtendDefaultTypes<{
        Objects: {
          SearchResultPage: SearchResultPage;
        };
        Scalars: {
          Date: { Input: Date; Output: Date };
          DateTime: { Input: Date; Output: Date };
          URL: { Input: string; Output: string };
          UUID: { Input: string; Output: string };
          JSON: { Input: any; Output: any };
        };
        PrismaTypes: PrismaTypes;
        Context: GQLContext;
      }>
    >
  | undefined;

export function getSchemaBuilder() {
  if (_schemaBuilder) {
    return _schemaBuilder;
  }
  _schemaBuilder = new SchemaBuilder<{
    Objects: {
      SearchResultPage: SearchResultPage;
    };
    Scalars: {
      Date: { Input: Date; Output: Date };
      DateTime: { Input: Date; Output: Date };
      URL: { Input: string; Output: string };
      UUID: { Input: string; Output: string };
      JSON: { Input: string; Output: string };
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
  _schemaBuilder.toSchema;
  _schemaBuilder.addScalarType("Date", DateResolver, {});
  _schemaBuilder.addScalarType("DateTime", DateTimeResolver, {});
  _schemaBuilder.addScalarType("URL", URLResolver, {});
  _schemaBuilder.addScalarType("UUID", UUIDResolver, {});
  _schemaBuilder.addScalarType("JSON", JSONResolver, {});

  // We create empty root query, mutation, and subscription
  // because we'll define individual nodes in other files
  // since those nodes can have multiple resolvers and possibly
  // can lead to really large and hard to read/navigate files
  _schemaBuilder.queryType({});
  _schemaBuilder.mutationType({});
  // _schemaBuilder.subscriptionType({});
  return _schemaBuilder;
}
