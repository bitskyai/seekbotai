# API

## Folder Structure

## GraphQL

### Best Practice

1. All queries and mutations should be defined in the `entities/xxxx` folder.
2. Try to avoid using the `SchemaTypes` approach to define backing models
3. User `schemaBuilder.objectRef<Shape>(name).implement({...})`, `schemaBuilder.inputRef<Shape>(name).implement({...})`, `schemaBuilder.prismaObject(name, {fields: t => {...}})` to define backing models. `Shape` should based on `@prisma/client` types.
4. Naming Convention:

- Type/Interface that extend/partial from `Prisma Types`, add `Shape` suffix. E.g. `PageMetadataShape`
- Backing Model, add `BM` suffix. E.g. `PageMetadataBM`

### How to add a query

Let us use get a user's all pages for example.

1. Add a new file in the `entities/page`. File format: `<query_name>.query.ts`. E.g. `pages.query.ts`
2.
