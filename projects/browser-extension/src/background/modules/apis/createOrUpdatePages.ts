import {
  CreateOrUpdatePagesDocument,
  type PageCreateOrUpdatePayload
} from "~/graphql/generated"
import { LogFormat } from "~helpers/LogFormat"
import { addToBackgroundSyncUpAPICreateOrUpdatePages } from "~storage"

import { getApolloClient } from "./apolloClient"

const logFormat = new LogFormat("apis/createOrUpdatePages")

export async function createOrUpdatePages(
  pages: PageCreateOrUpdatePayload[],
  skipAddToBackgroundSyncUp = false
) {
  console.info(...logFormat.formatArgs("createOrUpdatePages", { pages }))
  const apolloClient = await getApolloClient()
  if (!apolloClient) {
    if (skipAddToBackgroundSyncUp) {
      return
    }
    console.warn(
      ...logFormat.formatArgs(
        "createOrUpdatePages -> apolloClient is null, put to backgroundSyncUp"
      )
    )
    await addToBackgroundSyncUpAPICreateOrUpdatePages(pages)
    return
  }
  console.debug(
    ...logFormat.formatArgs("createOrUpdatePages -> apolloClient", {
      apolloClient
    })
  )
  const result = await apolloClient.mutate({
    mutation: CreateOrUpdatePagesDocument,
    variables: { pages }
  })
  console.debug(
    ...logFormat.formatArgs("createOrUpdatePages -> result", { result })
  )
  return result.data.createOrUpdatePages
}
