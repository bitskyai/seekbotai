export enum UserInteractionType {
  SEARCH = "search",
}

export type SearchDataType = {
  query: string;
};

export type UserInteraction = {
  type: string;
  data: object;
};
