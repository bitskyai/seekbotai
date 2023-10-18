import { GetIgnoreUrLsDocument, type IgnoreUrl } from "~/graphql/generated"
import { LogFormat } from "~helpers/LogFormat"
import {
  getIgnoreURLs as getIgnoreURLsFromStorage,
  setIgnoreURLs
} from "~storage"

import { getApolloClient } from "./apolloClient"

const logFormat = new LogFormat("apis/getIgnoreURLs")

export async function getIgnoreURLs() {
  const apolloClient = await getApolloClient()
  if (!apolloClient) {
    console.warn(
      ...logFormat.formatArgs(
        "apolloClient is null, getIgnoreURLs from storage"
      )
    )
    const ignoreURLs = await getIgnoreURLsFromStorage()
    return ignoreURLs
  }
  const result = await apolloClient.query({
    query: GetIgnoreUrLsDocument,
    fetchPolicy: "no-cache"
  })
  console.debug(...logFormat.formatArgs("getIgnoreURLs -> result", { result }))
  const ignoreURLs = result.data.ignoreURLs as IgnoreUrl[]
  await setIgnoreURLs(ignoreURLs)
  return ignoreURLs
}
