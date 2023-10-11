import { GetIgnoreUrLsDocument, type IgnoreUrl } from "~/graphql/generated"
import { LogFormat } from "~helpers/LogFormat"
import {
  getIgnoreURLs as getIgnoreURLsFromStorage,
  setIgnoreURLs
} from "~storage"

import { getApolloClient } from "./apolloClient"

const logFormat = new LogFormat("apis/createOrUpdatePages")

export async function getIgnoreURLs() {
  console.info(...logFormat.formatArgs("getIgnoreURLs"))
  const apolloClient = await getApolloClient()
  if (!apolloClient) {
    console.warn(
      ...logFormat.formatArgs(
        "getIgnoreURLs -> apolloClient is null, getIgnoreURLs from storage"
      )
    )
    const ignoreURLs = await getIgnoreURLsFromStorage()
    return ignoreURLs
  }
  console.debug(
    ...logFormat.formatArgs("getIgnoreURLs -> apolloClient", {
      apolloClient
    })
  )
  const result = await apolloClient.query({
    query: GetIgnoreUrLsDocument
  })
  console.debug(
    ...logFormat.formatArgs("createOrUpdatePages -> result", { result })
  )
  const ignoreURLs = result.data.ignoreURLs as IgnoreUrl[]
  await setIgnoreURLs(ignoreURLs)
  return ignoreURLs
}
