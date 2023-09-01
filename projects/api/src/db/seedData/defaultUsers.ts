// All default created users. BI is user based resources control.
// `systemUser`: Any resources only should be visible for system level
// `systemShare`: Any resources that shared with all users
// `systemPremium`: Any resources that share with all premium users
// `systemEnterprise`: Any resources that share with all enterprise users
// other users are placeholders for the future purpose
export const systemUser = {
  id: "ea8471a7-1b47-431e-b845-67720d81ab1b",
  username: "system",
  firstName: "System",
  lastName: "x",
  email: "system@bitsky.ai",
};

export const systemShare = {
  id: "52403322-0628-4a71-9358-dc36d4623fdf",
  username: "share",
  firstName: "Share",
  lastName: "x",
  email: "share@bitsky.ai",
};

export const systemPremium = {
  id: "37f48233-e23d-4fc5-bd01-b1e20098392e",
  username: "premium",
  firstName: "Premium",
  lastName: "x",
  email: "premium@bitsky.ai",
};

export const systemEnterprise = {
  id: "c401a817-0d4a-4c0b-ba13-cfb3f11bb28a",
  username: "enterprise",
  firstName: "Enterprise",
  lastName: "x",
  email: "enterprise@bitsky.ai",
};

export const systemPlaceHolder1 = {
  id: "5dc6bea6-59be-42ab-8106-be54a1d8f6ef",
  username: "placeHolder1",
  firstName: "PlaceHolder1",
  lastName: "x",
  email: "PlaceHolder1@bitsky.ai",
};

export const systemPlaceHolder2 = {
  id: "05f08f35-e63b-46c8-a620-cbb4b964532c",
  username: "placeHolder2",
  firstName: "PlaceHolder2",
  lastName: "x",
  email: "PlaceHolder2@bitsky.ai",
};

export const systemPlaceHolder3 = {
  id: "3c2ec626-83e6-4154-87a3-fe50aa4c3310",
  username: "placeHolder3",
  firstName: "PlaceHolder3",
  lastName: "x",
  email: "PlaceHolder3@bitsky.ai",
};

export const systemPlaceHolder4 = {
  id: "e171f7d0-4017-4c61-b6b2-a8e6ddfa366f",
  username: "placeHolder6",
  firstName: "PlaceHolder6",
  lastName: "x",
  email: "PlaceHolder6@bitsky.ai",
};

export const systemPlaceHolder5 = {
  id: "b9cc8d39-68c9-418e-a861-17dcca8b4ce0",
  username: "placeHolder7",
  firstName: "PlaceHolder7",
  lastName: "x",
  email: "PlaceHolder7@bitsky.ai",
};

export const defaultUser = {
  id: "b271b74d-d6fa-4bed-b11e-dfbbf95e03f3",
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
