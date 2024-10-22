import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  URL: any;
  UUID: any;
};

export type CreateOrUpdatePageRes = {
  __typename?: 'CreateOrUpdatePageRes';
  code?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type DeletePagePayload = {
  ignore?: InputMaybe<Scalars['Boolean']>;
  pageId: Scalars['String'];
  pattern?: InputMaybe<Scalars['String']>;
  regularExpression?: InputMaybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrUpdatePages: Array<CreateOrUpdatePageRes>;
  deleteIgnoreURLs: MutationRes;
  deletePages: MutationRes;
  updatePageMetadata: PageMetadata;
  updatePageTags: MutationRes;
};


export type MutationCreateOrUpdatePagesArgs = {
  operationName?: InputMaybe<Scalars['String']>;
  pages: Array<PageCreateOrUpdatePayload>;
};


export type MutationDeleteIgnoreUrLsArgs = {
  deleteIgnoreURLs: Array<DeleteIgnoreUrlPayload>;
};


export type MutationDeletePagesArgs = {
  pages: Array<DeletePagePayload>;
};


export type MutationUpdatePageMetadataArgs = {
  pageId: Scalars['String'];
  pageMetadata: UpdatablePageMetadataPayload;
};


export type MutationUpdatePageTagsArgs = {
  pageId: Scalars['String'];
  pageTags: Array<UpdatePageTagPayload>;
};

export type MutationRes = {
  __typename?: 'MutationRes';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Page = {
  __typename?: 'Page';
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  pageMetadata: PageMetadata;
  pageTags: Array<PageTag>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  url: Scalars['URL'];
};

export type PageCreateOrUpdatePayload = {
  content?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  pageMetadata?: InputMaybe<PageMetadataPayload>;
  pageTags?: InputMaybe<Array<PageTagPayload>>;
  raw?: InputMaybe<Scalars['String']>;
  screenshot?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type PageMetadata = {
  __typename?: 'PageMetadata';
  bookmarked?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['DateTime'];
  displayDescription?: Maybe<Scalars['String']>;
  displayTitle?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  incognito?: Maybe<Scalars['Boolean']>;
  lastVisitTime?: Maybe<Scalars['DateTime']>;
  localMode?: Maybe<Scalars['Boolean']>;
  pageId: Scalars['UUID'];
  tabId?: Maybe<Scalars['Int']>;
  typedCount?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
  version: Scalars['Int'];
  visitCount?: Maybe<Scalars['Int']>;
};

export type PageMetadataDetail = {
  __typename?: 'PageMetadataDetail';
  bookmarked?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['DateTime'];
  displayDescription?: Maybe<Scalars['String']>;
  displayTitle?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  incognito?: Maybe<Scalars['Boolean']>;
  lastVisitTime?: Maybe<Scalars['DateTime']>;
  localMode?: Maybe<Scalars['Boolean']>;
  pageId: Scalars['UUID'];
  screenshot?: Maybe<Scalars['String']>;
  screenshotPreview?: Maybe<Scalars['String']>;
  tabId?: Maybe<Scalars['Int']>;
  typedCount?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
  version: Scalars['Int'];
  visitCount?: Maybe<Scalars['Int']>;
};

export type PageMetadataPayload = {
  bookmarked?: InputMaybe<Scalars['Boolean']>;
  displayDescription?: InputMaybe<Scalars['String']>;
  displayTitle?: InputMaybe<Scalars['String']>;
  favorite?: InputMaybe<Scalars['Boolean']>;
  incognito?: InputMaybe<Scalars['Boolean']>;
  lastVisitTime?: InputMaybe<Scalars['DateTime']>;
  localMode?: InputMaybe<Scalars['Boolean']>;
  tabId?: InputMaybe<Scalars['Int']>;
  typedCount?: InputMaybe<Scalars['Int']>;
  visitCount?: InputMaybe<Scalars['Int']>;
};

export type PageSortOrderInput = {
  updatedAt?: InputMaybe<SortOrder>;
};

export type PageTag = {
  __typename?: 'PageTag';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  pageId: Scalars['UUID'];
  tag: Tag;
  updatedAt: Scalars['DateTime'];
  version: Scalars['Int'];
};

export type PageTagDetail = {
  __typename?: 'PageTagDetail';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  pageId: Scalars['UUID'];
  tag: TagDetail;
  updatedAt: Scalars['DateTime'];
  version: Scalars['Int'];
};

export type PageTagPayload = {
  name: Scalars['String'];
};

export type Preference = {
  __typename?: 'Preference';
  apiKey: Scalars['String'];
  id: Scalars['ID'];
  indexFrequency: Scalars['Int'];
  logLevel: Scalars['String'];
  logSize: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  ignoreURLs: Array<IgnoreUrl>;
  pageMetadata: Array<PageMetadata>;
  pageTags: Array<PageTag>;
  pages: Array<SearchResultPage>;
  preference: Preference;
  tags: Array<Tag>;
  user: User;
};


export type QueryPagesArgs = {
  insensitive?: InputMaybe<Scalars['Boolean']>;
  orderBy?: InputMaybe<PageSortOrderInput>;
  searchString?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  take?: InputMaybe<Scalars['Int']>;
};

export type SearchResultPage = {
  __typename?: 'SearchResultPage';
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  pageMetadata: PageMetadataDetail;
  pageTags: Array<PageTagDetail>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  url: Scalars['URL'];
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type Tag = {
  __typename?: 'Tag';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  isSystem: Scalars['Boolean'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type TagDetail = {
  __typename?: 'TagDetail';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type UpdatablePageMetadataPayload = {
  bookmarked?: InputMaybe<Scalars['Boolean']>;
  displayDescription?: InputMaybe<Scalars['String']>;
  displayTitle?: InputMaybe<Scalars['String']>;
  favorite?: InputMaybe<Scalars['Boolean']>;
  incognito?: InputMaybe<Scalars['Boolean']>;
  localMode?: InputMaybe<Scalars['Boolean']>;
  pageId?: InputMaybe<Scalars['String']>;
  tabId?: InputMaybe<Scalars['Int']>;
};

export type UpdatePageTagPayload = {
  name: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  ignoreURLs?: Maybe<Array<IgnoreUrl>>;
  preference?: Maybe<Preference>;
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type DeleteIgnoreUrlPayload = {
  id: Scalars['String'];
};

export type IgnoreUrl = {
  __typename?: 'ignoreURL';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  pattern: Scalars['String'];
  regularExpression: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
};

export type CreateOrUpdatePagesMutationVariables = Exact<{
  pages: Array<PageCreateOrUpdatePayload> | PageCreateOrUpdatePayload;
  operationName?: InputMaybe<Scalars['String']>;
}>;


export type CreateOrUpdatePagesMutation = { __typename?: 'Mutation', createOrUpdatePages: Array<{ __typename?: 'CreateOrUpdatePageRes', url: string, status?: string | null, id?: string | null, code?: string | null, message?: string | null }> };

export type DeleteIgnoreUrLsMutationVariables = Exact<{
  deleteIgnoreURLs: Array<DeleteIgnoreUrlPayload> | DeleteIgnoreUrlPayload;
}>;


export type DeleteIgnoreUrLsMutation = { __typename?: 'Mutation', deleteIgnoreURLs: { __typename?: 'MutationRes', success: boolean, message?: string | null } };

export type GetIgnoreUrLsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIgnoreUrLsQuery = { __typename?: 'Query', ignoreURLs: Array<{ __typename?: 'ignoreURL', id: string, pattern: string, regularExpression: boolean }> };


export const CreateOrUpdatePagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createOrUpdatePages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pages"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PageCreateOrUpdatePayload"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"operationName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"createOrUpdatePages","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrUpdatePages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pages"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pages"}}},{"kind":"Argument","name":{"kind":"Name","value":"operationName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"operationName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateOrUpdatePagesMutation, CreateOrUpdatePagesMutationVariables>;
export const DeleteIgnoreUrLsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIgnoreURLs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteIgnoreURLs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"deleteIgnoreURLPayload"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIgnoreURLs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deleteIgnoreURLs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteIgnoreURLs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteIgnoreUrLsMutation, DeleteIgnoreUrLsMutationVariables>;
export const GetIgnoreUrLsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIgnoreURLs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ignoreURLs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"regularExpression"}}]}}]}}]} as unknown as DocumentNode<GetIgnoreUrLsQuery, GetIgnoreUrLsQueryVariables>;