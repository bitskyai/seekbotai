import { Storage } from "@plasmohq/storage"

import { type IgnoreUrl } from "~/graphql/generated"
import { LogFormat } from "~helpers/LogFormat"

import { StorageKeys } from "./storageKeys"

const logFormat = new LogFormat("storage/ignoreURLs")

export type IgnoreUrlHistory = Pick<
  IgnoreUrl,
  "id" | "pattern" | "regularExpression"
> & { url: string; ignoreAt: number }

export async function getIgnoreURLs() {
  const storage = new Storage({ area: "local" })
  const ignoreURLs = await storage.get<IgnoreUrl[]>(StorageKeys.IgnoreURLs)
  console.debug(
    ...logFormat.formatArgs("getIgnoreURLs -> ignoreURLs", { ignoreURLs })
  )
  return ignoreURLs
}

export async function setIgnoreURLs(ignoreURLs: IgnoreUrl[]) {
  const storage = new Storage({ area: "local" })
  await storage.set(StorageKeys.IgnoreURLs, ignoreURLs)
  console.debug(
    ...logFormat.formatArgs("setIgnoreURLs -> ignoreURLs", { ignoreURLs })
  )
  return true
}

export async function addIgnoreURLHistory(ignoreUrlHistory: IgnoreUrlHistory) {
  const storage = new Storage({ area: "local" })
  if (!ignoreUrlHistory.ignoreAt) {
    ignoreUrlHistory.ignoreAt = Date.now()
  }
  const ignoreURLsHistory =
    (await storage.get<IgnoreUrlHistory[]>(StorageKeys.IgnoreURLsHistory)) || []
  ignoreURLsHistory.push(ignoreUrlHistory)
  await storage.set(StorageKeys.IgnoreURLsHistory, ignoreURLsHistory)
  console.debug(
    ...logFormat.formatArgs("addIgnoreURLHistory", { ignoreUrlHistory })
  )
  return true
}

export async function getIgnoreURLsHistory() {
  const storage = new Storage({ area: "local" })
  const ignoreURLsHistory =
    (await storage.get<IgnoreUrlHistory[]>(StorageKeys.IgnoreURLsHistory)) || []
  console.debug(
    ...logFormat.formatArgs("getIgnoreURLsHistory -> ignoreURLsHistory", {
      ignoreURLsHistory
    })
  )
  return ignoreURLsHistory
}
