import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  concat
} from "@apollo/client"

import { LogFormat } from "./LogFormat"

const logFormat = new LogFormat("helpers/apolloClientFactory")

export const newApolloClient = async ({
  protocol,
  hostName,
  port,
  apiKey
}: {
  protocol: string
  hostName: string
  port: Number
  apiKey: string
}) => {
  if (!protocol || !hostName) {
    console.error(
      ...logFormat.formatArgs(
        "newApolloClient",
        "protocol or hostName is empty"
      )
    )
    return null
  }
  let uri = `${protocol}://${hostName}`
  if (port) {
    uri = `${uri}:${port}`
  }
  uri = `${uri}/graphql`
  console.info(...logFormat.formatArgs("newApolloClient", uri))
  const httpLink = new HttpLink({ uri })
  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    if (apiKey) {
      console.info(...logFormat.formatArgs("newApolloClient", uri))
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: `Bearer ${apiKey}` || null
        }
      }))
    }
    return forward(operation)
  })

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: concat(authMiddleware, httpLink)
  })
  return client
}
