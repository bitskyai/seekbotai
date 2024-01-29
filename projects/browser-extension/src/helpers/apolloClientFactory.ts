import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  type NormalizedCacheObject,
  concat
} from "@apollo/client"

import { LogFormat } from "./LogFormat"
import { getSeekBotHeaders } from "./util"

const logFormat = new LogFormat("helpers/apolloClientFactory")

const noCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {}
    },
    Mutation: {
      fields: {}
    }
  }
})

export const newApolloClient = async ({
  protocol,
  hostName,
  port,
  apiKey
}: {
  protocol: string
  hostName: string
  port: number
  apiKey: string
}): Promise<ApolloClient<NormalizedCacheObject>> => {
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
  const seekbotHeaders = await getSeekBotHeaders()
  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    if (apiKey) {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: `Bearer ${apiKey}` || null
        }
      }))
    }
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...seekbotHeaders
      }
    }))
    return forward(operation)
  })

  const client = new ApolloClient({
    cache: noCache,
    link: concat(authMiddleware, httpLink),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore"
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all"
      }
    }
  })
  return client
}
