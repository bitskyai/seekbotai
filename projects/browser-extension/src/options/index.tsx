import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import React from "react"
import { RouterProvider } from "react-router-dom"

import "./index.css"

import { router } from "./routes"

// TODO: need to get from preferences
const url = `http://localhost:4000/graphql`

const apolloClient = new ApolloClient({
  uri: url,
  cache: new InMemoryCache()
})

function Options() {
  return (
    <React.StrictMode>
      <ApolloProvider client={apolloClient}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </React.StrictMode>
  )
}

export default Options
