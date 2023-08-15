import { LogFormat } from "~helpers/LogFormat"

import { init as apolloClientInit } from "./apolloClient"

export * from "./createBookmarks"

export { setApolloClientToNull } from "./apolloClient"

const logFormat = new LogFormat("apis")

export const init = async () => {
  console.info(...logFormat.formatArgs("init"))
  await apolloClientInit()
}
