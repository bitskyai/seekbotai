import { ApolloClient, InMemoryCache } from "@apollo/client"

const uri = `http://localhost:4000/graphql`
const apolloClient = new ApolloClient({
  uri,
  cache: new InMemoryCache()
})

export default apolloClient
