require('now-env')
require('dotenv').config()

// TODO validate jwt (for all mutations)
// TODO error if invalid
// TODO pass validated jwt to context

const massive = require('massive')
const { ApolloServer } = require('apollo-server')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

massive({
  // poolsize: 20, // default is 10
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
})
  .then(db => {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ db })
    })

    server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`)
    })
  })
  .catch(console.error)
