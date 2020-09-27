const { ApolloServer, gql } = require('apollo-server')

const todos = [
  { task: 'Wash car', completed: false },
  { task: 'Clean room', completed: true},
];

const typeDefs = gql`
  type Query {
    getTodos: [Todo]
  }

  type Mutation {
    addTodo(task: String, completed: Boolean): Todo
  }

  type Todo {
    task: String
    completed: Boolean
  }
`

const resolvers = {
  Query: {
    getTodos: () => {
      return todos
    }
  },
  Mutation: {
    addTodo: (_, { task, completed }) => {
      const todo = { task, completed }
      todos.push(todo)
      return todo
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`server listening on ${url}`);
})