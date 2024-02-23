import {
  CreateOrUpdatePagesDocument,
  type PageCreateOrUpdatePayload
} from "~/graphql/generated"
import { whetherIgnore } from "~background/modules/ignoreURLs"
import { LogFormat } from "~helpers/LogFormat"
import { releaseMemory } from "~helpers/util"
import { addToBackgroundSyncUpAPICreateOrUpdatePages } from "~storage"

import { getApolloClient } from "./apolloClient"

const logFormat = new LogFormat("apis/createOrUpdatePages")

export async function createOrUpdatePages(
  pages: PageCreateOrUpdatePayload[],
  skipAddToBackgroundSyncUp = false,
  options?: { checkWhetherIgnore?: boolean; operationName?: string }
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

  let filteredPages = pages
  if (options?.checkWhetherIgnore) {
    filteredPages = pages.filter((page) => !whetherIgnore(page.url))
  }

  const result = await apolloClient.mutate({
    mutation: CreateOrUpdatePagesDocument,
    variables: { pages: filteredPages, operationName: options?.operationName },
    fetchPolicy: "no-cache"
  })
  console.debug(
    ...logFormat.formatArgs("createOrUpdatePages -> result", { result })
  )
  releaseMemory(pages)
  return result.data.createOrUpdatePages
}
