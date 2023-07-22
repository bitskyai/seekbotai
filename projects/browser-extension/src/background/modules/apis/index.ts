import {init as apolloClientInit} from "./apolloClient"
export * from  "./createBookmarks"

export const init = async () => {
  await apolloClientInit()
}
