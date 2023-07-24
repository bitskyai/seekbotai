// import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import React from "react"
import { RouterProvider } from "react-router-dom"

import "./index.css"

import { router } from "./routes"

function Options() {
  return (
    <React.StrictMode>
      {/* <ApolloProvider client={apolloClient}> */}
      <RouterProvider router={router} />
      {/* </ApolloProvider> */}
    </React.StrictMode>
  )
}

export default Options
