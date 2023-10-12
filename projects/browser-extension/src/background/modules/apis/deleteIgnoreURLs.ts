import {
  DeleteIgnoreUrLsDocument,
  type DeleteIgnoreUrlPayload
} from "~/graphql/generated"
import { LogFormat } from "~helpers/LogFormat"
import { deleteIgnoreURLs as deleteIgnoreURLsFromStorage } from "~storage"

import { getApolloClient } from "./apolloClient"

const logFormat = new LogFormat("apis/deleteIgnoreURLs")

export async function deleteIgnoreURLs(ignoreURLs: DeleteIgnoreUrlPayload[]) {
  const apolloClient = await getApolloClient()
  if (!apolloClient) {
    console.warn(...logFormat.formatArgs("apolloClient is null"))
    return false
  }
  const result = await apolloClient.mutate({
    mutation: DeleteIgnoreUrLsDocument,
    variables: {
      deleteIgnoreURLs: ignoreURLs
    }
  })
  console.debug(
    ...logFormat.formatArgs("createOrUpdatePages -> result", { result })
  )

  if (result.data?.deleteIgnoreURLs?.success) {
    await deleteIgnoreURLsFromStorage(ignoreURLs)
  }
  return true
}
