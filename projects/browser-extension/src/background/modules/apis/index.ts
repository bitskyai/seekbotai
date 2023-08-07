import { init as apolloClientInit } from "./apolloClient"

export * from "./createBookmarks"

export { setApolloClientToNull } from "./apolloClient"

export const init = async () => {
  await apolloClientInit()
}
