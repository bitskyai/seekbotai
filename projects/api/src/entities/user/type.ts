import type { User, Preference, IgnoreURL } from "@prisma/client";

const FullUser: User & {
  preference: Preference;
  ignoreURLs: IgnoreURL[];
} = {
  ...({} as User),
  preference: {} as Preference,
  ignoreURLs: [] as IgnoreURL[],
};

export type UserShape = typeof FullUser;
