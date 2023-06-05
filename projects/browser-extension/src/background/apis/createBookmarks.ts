import {
  type BookmarkCreateInputType,
  CreateBookmarksDocument
} from "~/graphql/generated"

import apolloClient from "./apolloClient"

export default async function createBookmarks(
  bookmarks: BookmarkCreateInputType[]
) {
  const result = await apolloClient.mutate({
    mutation: CreateBookmarksDocument,
    variables: { bookmarks }
  })

  return result.data.createBookmarks
}
