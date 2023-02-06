import { createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
import {schema} from "./schema";
// 2
const port = Number(process.env.API_PORT) || 4000
const yoga = createYoga({ schema })
const server = createServer(yoga);
// 4
server.listen(port, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})