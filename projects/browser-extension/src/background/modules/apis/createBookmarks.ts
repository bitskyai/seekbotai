import {
  type BookmarkCreateInputType,
  CreateBookmarksDocument
} from "~/graphql/generated"
import { LogFormat } from "~helpers/LogFormat"
import { addToBackgroundSyncUpAPICreateOrUpdatePages } from "~storage"

import { getApolloClient } from "./apolloClient"

const logFormat = new LogFormat("apis/createBookmarks")

export async function createBookmarks(
  bookmarks: BookmarkCreateInputType[],
  skipAddToBackgroundSyncUp = false
) {
  console.info(...logFormat.formatArgs("createBookmarks", { bookmarks }))
  const apolloClient = await getApolloClient()
  if (!apolloClient) {
    if (skipAddToBackgroundSyncUp) {
      return
    }
    console.warn(
      ...logFormat.formatArgs(
        "createBookmarks -> apolloClient is null, put to backgroundSyncUp"
      )
    )
    await addToBackgroundSyncUpAPICreateOrUpdatePages(bookmarks)
    return
  }
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
