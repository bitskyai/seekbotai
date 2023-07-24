import {
  type BookmarkCreateInputType,
  CreateBookmarksDocument
} from "~/graphql/generated"
import { LogFormat } from "~helpers/LogFormat"

import { getApolloClient } from "./apolloClient"

const logFormat = new LogFormat("apis/createBookmarks")

export async function createBookmarks(bookmarks: BookmarkCreateInputType[]) {
  console.info(...logFormat.formatArgs("createBookmarks", { bookmarks }))
  const apolloClient = await getApolloClient()
  console.debug(
    ...logFormat.formatArgs("createBookmarks -> apolloClient", { apolloClient })
  )
  const result = await apolloClient.mutate({
    mutation: CreateBookmarksDocument,
    variables: { bookmarks }
  })
  console.debug(
    ...logFormat.formatArgs("createBookmarks -> result", { result })
  )
  return result.data.createBookmarks
}