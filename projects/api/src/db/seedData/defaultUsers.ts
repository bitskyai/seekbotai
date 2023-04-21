// All default created users. BI is user based resources control.
// `systemUser`: Any resources only should be visible for system level
// `systemShare`: Any resources that shared with all users
// `systemPremium`: Any resources that share with all premium users
// `systemEnterprise`: Any resources that share with all enterprise users
// other users are placeholders for the future purpose
export const systemUser = {
  id: 1,
  username: "system",
  firstName: "System",
  lastName: "x",
  email: "system@bitsky.ai",
};

export const systemShare = {
  id: 2,
  username: "share",
  firstName: "Share",
  lastName: "x",
  email: "share@bitsky.ai",
};

export const systemPremium = {
  id: 3,
  username: "premium",
  firstName: "Premium",
  lastName: "x",
  email: "premium@bitsky.ai",
};

export const systemEnterprise = {
  id: 4,
  username: "enterprise",
  firstName: "Enterprise",
  lastName: "x",
  email: "enterprise@bitsky.ai",
};

export const systemPlaceHolder1 = {
  id: 5,
  username: "placeHolder1",
  firstName: "PlaceHolder1",
  lastName: "x",
  email: "PlaceHolder1@bitsky.ai",
};

export const systemPlaceHolder2 = {
  id: 6,
  username: "placeHolder2",
  firstName: "PlaceHolder2",
  lastName: "x",
  email: "PlaceHolder2@bitsky.ai",
};

export const systemPlaceHolder3 = {
  id: 7,
  username: "placeHolder3",
  firstName: "PlaceHolder3",
  lastName: "x",
  email: "PlaceHolder3@bitsky.ai",
};

export const systemPlaceHolder4 = {
  id: 8,
  username: "placeHolder6",
  firstName: "PlaceHolder6",
  lastName: "x",
  email: "PlaceHolder6@bitsky.ai",
};

export const systemPlaceHolder5 = {
  id: 9,
  username: "placeHolder7",
  firstName: "PlaceHolder7",
  lastName: "x",
  email: "PlaceHolder7@bitsky.ai",
};

export const defaultUser = {
  id: 10,
  username: "skywalker",
  firstName: "Skywalker",
  lastName: "x",
  email: "skywalker.x@bitsky.ai",
};

export default [
  systemUser,
  systemShare,
  systemPremium,
  systemEnterprise,
  systemPlaceHolder1,
  systemPlaceHolder2,
  systemPlaceHolder3,
  systemPlaceHolder4,
  systemPlaceHolder5,
  defaultUser,
];
