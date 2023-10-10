import { defaultUser } from "./defaultUsers";

export const ignoreURLs = [
  {
    id: "ed234a33-df48-45c4-86bc-8ec34e92e2ec",
    pattern: "chrome://*",
    regularExpression: false,
    userId: defaultUser.id,
  },
];
