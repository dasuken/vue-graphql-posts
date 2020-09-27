const { ApolloServer, AuthenticationError } = require('apollo-server')
const mongoose         = require('mongoose')
const path             = require('path')
const fs               = require('fs')
const jwt = require('jsonwebtoken')

const schemaPath = path.join(__dirname, 'typeDefs.gql')
const typeDefs   = fs.readFileSync(schemaPath, "utf-8")

const resolvers  = require('./resolvers.js')

require('dotenv').config({ path: 'variables.env' })
const User       = require('./models/User')
const Post       = require('./models/Post')

mongoose
  .connect(process.env.MONGO_URI,
    { useUnifiedTopology: true },
    { useNewUrlParser: true })
  .then(_ => console.log('DB CONNECTED'))
  .catch(err => console.log(err))

const getUser = token => {
  if (token) {
    try {
      return jwt.verify(token, process.env.SECRET)
    } catch (err) {
      console.log(err);
      throw new AuthenticationError("Your session has ended please sign in agein")
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => ({
    name: error.name,
    message: error.message.replace("Context creation failed:", "")
  }),
  context: async ({ req }) => {
    const token = req.headers["authorization"]

    return { User,Post, currentUser: await getUser(token) }
  }
})

server.listen().then(({ url }) => {
  console.log(`server listening on ${url}`);
})