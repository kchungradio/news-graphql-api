require('now-env')
require('dotenv').config()

const massive = require('massive')
const { ApolloServer, ApolloError } = require('apollo-server')
const jwt = require('jsonwebtoken')

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
      formatError: error => {
        console.log(error)
        return error
      },
      context: ({ req }) => {
        const [bearer, token] = req.headers.authorization.split(' ')

        let user
        if (bearer === 'Bearer' && token) {
          try {
            user = jwt.verify(token, process.env.JWS_SECRET)
          } catch (err) {
            if (req.body.query.includes('mutation')) {
              throw new ApolloError('Unauthorized', 401)
            }
          }
        }

        return { db, user }
      },
      cors: true
    })

    server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`)
    })
  })
  .catch(console.error)
