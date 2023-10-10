import type { Preference, IgnoreURL } from "@prisma/client";

export type PreferenceShape = Partial<Preference>;

export type IgnoreURLShape = Partial<IgnoreURL>;

export type QueryPreference = PreferenceShape & {
  ignoreURLs?: IgnoreURL[];
};
