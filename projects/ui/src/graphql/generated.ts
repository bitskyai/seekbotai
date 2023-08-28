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

export type Mutation = {
  __typename?: 'Mutation';
  createOrUpdatePages: Array<CreateOrUpdatePageRes>;
};


export type MutationCreateOrUpdatePagesArgs = {
  pages: Array<PageCreateOrUpdatePayload>;
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
  title: Scalars['String'];
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
  localMode?: Maybe<Scalars['Boolean']>;
  pageId: Scalars['UUID'];
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

export type PageTagPayload = {
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  pageMetadata: Array<PageMetadata>;
  pageTags: Array<PageTag>;
  pages: Array<Page>;
  tags: Array<Tag>;
};


export type QueryPagesArgs = {
  insensitive?: InputMaybe<Scalars['Boolean']>;
  orderBy?: InputMaybe<PageSortOrderInput>;
  searchString?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  take?: InputMaybe<Scalars['Int']>;
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

export type GetPagesQueryVariables = Exact<{
  tags?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  searchString?: InputMaybe<Scalars['String']>;
}>;


export type GetPagesQuery = { __typename?: 'Query', pages: Array<{ __typename?: 'Page', createdAt: any, updatedAt: any, title: string, description?: string | null, icon?: string | null, id: any, url: any, pageMetadata: { __typename?: 'PageMetadata', id: string, bookmarked?: boolean | null, displayTitle?: string | null, displayDescription?: string | null, favorite?: boolean | null, incognito?: boolean | null, localMode?: boolean | null, tabId?: number | null, typedCount?: number | null, visitCount?: number | null }, pageTags: Array<{ __typename?: 'PageTag', createdAt: any, id: string, tag: { __typename?: 'Tag', createdAt: any, id: string, isSystem: boolean, name: string } }> }> };

export type GetTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', createdAt: any, id: string, isSystem: boolean, name: string }> };


export const GetPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tags"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchString"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchString"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchString"}}},{"kind":"Argument","name":{"kind":"Name","value":"tags"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tags"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"pageMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bookmarked"}},{"kind":"Field","name":{"kind":"Name","value":"displayTitle"}},{"kind":"Field","name":{"kind":"Name","value":"displayDescription"}},{"kind":"Field","name":{"kind":"Name","value":"favorite"}},{"kind":"Field","name":{"kind":"Name","value":"incognito"}},{"kind":"Field","name":{"kind":"Name","value":"localMode"}},{"kind":"Field","name":{"kind":"Name","value":"tabId"}},{"kind":"Field","name":{"kind":"Name","value":"typedCount"}},{"kind":"Field","name":{"kind":"Name","value":"visitCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPagesQuery, GetPagesQueryVariables>;
export const GetTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetTagsQuery, GetTagsQueryVariables>;