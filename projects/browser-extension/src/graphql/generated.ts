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
};

export type Bookmark = {
  __typename?: 'Bookmark';
  bookmarkTags: Array<BookmarkTag>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  favorite: Scalars['Boolean'];
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  url: Scalars['String'];
};

export type BookmarkCreateInputType = {
  bookmarkTags?: InputMaybe<Array<Scalars['String']>>;
  content?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  raw?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type BookmarkResult = {
  __typename?: 'BookmarkResult';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type BookmarkSortOrderInput = {
  updatedAt?: InputMaybe<SortOrder>;
};

export type BookmarkTag = {
  __typename?: 'BookmarkTag';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  tag: Tag;
};

export type CreateBookmarksRes = {
  __typename?: 'CreateBookmarksRes';
  code?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBookmarks: Array<CreateBookmarksRes>;
};


export type MutationCreateBookmarksArgs = {
  bookmarks: Array<BookmarkCreateInputType>;
};

export type Query = {
  __typename?: 'Query';
  bookmarks: Array<Bookmark>;
  tags: Array<Tag>;
};


export type QueryBookmarksArgs = {
  insensitive?: InputMaybe<Scalars['Boolean']>;
  orderBy?: InputMaybe<BookmarkSortOrderInput>;
  searchString?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Array<Scalars['Int']>>;
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
};

export type CreateBookmarksMutationVariables = Exact<{
  bookmarks: Array<BookmarkCreateInputType> | BookmarkCreateInputType;
}>;


export type CreateBookmarksMutation = { __typename?: 'Mutation', createBookmarks: Array<{ __typename?: 'CreateBookmarksRes', url: string, status?: string | null, id?: number | null, code?: string | null, message?: string | null }> };


export const CreateBookmarksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createBookmarks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookmarks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookmarkCreateInputType"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBookmarks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookmarks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookmarks"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateBookmarksMutation, CreateBookmarksMutationVariables>;