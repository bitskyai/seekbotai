# Database

This document describe the database design and useful tools help you speed up

## Best Practices

1. Plan before designing: Before starting to design a database, it's important to have a clear understanding of **what data** the database will store and **how it will be used**.
2. Naming Conventions. Standards:
   - Use lowercase letters
   - Use descriptive names. i.g. Use `customer` instead of `c`
   - Use underscores. i.g. `order_item`
   - Use Plural, this can help to reduce collision with revered names
   - Be consistent
   - Avoid reserved words
   - Use prefixes and suffixes.
     1. Prefixes:
        - "tbl*" or "tab*" for tables
        - "vw*" or "view*" for views
        - "sp*" or "usp*" for stored procedures
        - "fn*" or "udf*" for user-defined functions
        - "idx\_" for indexes
        - "trg\_" for triggers
     2. Suffixes:
        - "\_id" for primary key columns
        - "\_cd" or "\_code" for codes or identifiers
        - "\_desc" or "\_description" for descriptions
        - "\_amt" or "\_amount" for monetary values
        - "\_dt" or "\_date" for dates
        - "\_tm" or "\_time" for times
        - "\_flag" or "\_status" for boolean values
        - "\_cnt" or "\_count" for count values
3. Normalize Data. Normalization is the process of organizing data in a way that reduces redundancy and dependency. By normalizing your data, you can improve data consistency and reduce data duplication
4. Use **primary and foreign keys**: Primary keys are unique identifiers for each record in a table, while foreign keys are used to link records between tables. Using primary and foreign keys ensures data integrity and makes it easier to query the database.
   - Choose a primary key to prevent **hotspots**, Do not choose a column whose value monotonically increases or decreases as the first key part for a high write rate table.
5. [Data Security](https://www.integrate.io/the-complete-guide-to-data-security/). Use encryption for sensitive data such as personally identifiable information (PII) and passwords
6. Choose appropriate data types
7. Use indexes. Indexes are used to speed up queries by providing fast access to specific data in a table. Be careful not to create too many indexes, as they can slow down data updates
8. Use constraints: Constraints are used to enforce business rules and data integrity. For example, you can use constraints to ensure that a column cannot contain null values, or to enforce a maximum length for a column.
9. Backup and maintain your database: Regular backups and maintenance tasks, such as defragmenting indexes, can help ensure that your database remains reliable and performs well over time.

## Libraries and Tools

Since this product is implemented by NodeJS(Typescript), and by design this product should be able to work on both desktop version and cloud version. This means we need to support at least two type of database: sqlite and one of (postgresql, mysql ...), so an ORM is necessary for this product. After research, I choose [prisma](https://www.prisma.io/).

> Prisma did a pretty good comparing with other ORMs - [Comparing Prisma](https://www.prisma.io/docs/concepts/more/comparisons). For me one big reason is Prisma has a very well document and support

### Recommend Tools:

1. [DB Browser for SQLite](https://sqlitebrowser.org/): A database browser for SQLite
2. [Railway](https://railway.app/): Provision a test database. For now, please provision PostgreSQL

## Bookmark Intelligence ERD

Please read [Bookmark Intelligence ERD](https://lucid.app/lucidchart/2bac9da0-4e10-491c-a509-eb68ba695403/edit?beaconFlowId=0AB803401E4957D7&invitationId=inv_77370d48-ebf7-41ed-b3dd-ac1856bcb367&page=0_0#) to have a high-level understanding of database schema

### Tables

1. `bk_user`: Contains all users. In desktop version, it will use default user - `skywalker`
2. ``:

## CRUD Schema

### Step 1: CRUD a Schema

1. Add new Schema to [Bookmark Intelligence ERD](https://lucid.app/lucidchart/2bac9da0-4e10-491c-a509-eb68ba695403/edit?beaconFlowId=0AB803401E4957D7&invitationId=inv_77370d48-ebf7-41ed-b3dd-ac1856bcb367&page=0_0#)
2. Add Schema to `projects/api/prisma/schema.prisma`
   - Model uses `Upper Camel Case`. E.g: `BookmarkContent`
   - Table uses `Lower Snake Case` with prefix `bk_`. E.g: `bk_bookmark_content`
3. Common fields for all tables

```
id        Int      @id @default(uuid())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
```

### Step 2: Run `yarn migration:dev` in `projects/api`

This command did two things:

1. It creates a new SQL migration file for this migration in the projects/api/prisma/migrations directory.
2. It runs the SQL migration file against the database.

> After Step 2 are only apply to `SQLite`

### Step 3: Run `yarn reset` in `projects/api`

It will reset your database to latest migration and clean all data.

### Step 4: Copy `bi-api.db`

After reset, you should get a latest db without any data, copy `projects/api/.bi-api/bi-api.db` to `projects/api/prisma/bi-latest.db`

## Migration

After you change schema, you need to run `yarn migration:dev` in `projects/api`

1. Keep your database schema in sync with your Prisma schema
2. Maintain existing data in your database

## Seed

Seed has two parts:

1. Seed for dev env. You can run `yarn seed` in `projects/api`. It seeds mock data to database
2. Seed for prod, it will be automatically checked and run during app start. Like: add a default user for desktop version, add default tags, add demo data... This kind of seed data should be maintained in `projects/api/prisma/seeds/prod`. General seed for prod only used for desktop app for now.

## FAQs

### Why id use `uuid`

The reason is if need to store cross platform sync, `uuid` can avoid conflict. For example, if we use `autoincrement` for `id`, and we have two devices, one is device 1, one is device 2. If device 1 create a bookmark with `id` = 1, and device 2 create a bookmark with `id` = 1, then we have conflict. But if we use `uuid`, we don't have this problem.
