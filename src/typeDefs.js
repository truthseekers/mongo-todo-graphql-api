const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String!
    users(text: String): [User!]!
    todos(filter: String, takeStatus: String, skip: Int, take: Int): Todos!
    me: User
  }

  type Mutation {
    signup(
      firstName: String!
      email: String!
      password: String!
      paymentMethod: String!
      age: Int
    ): User
    login(email: String!, password: String!): User
    logout: Boolean
    createTodo(name: String!, isComplete: Boolean!, userId: ID!): Todo
    deleteTodo(todoId: ID!): Todo
    updateTodo(todoId: ID!, name: String, isComplete: Boolean): Todo
    deleteTodos(todoIds: [ID!]!): BatchPayload!
    resetTodos(todoIds: [ID!]!): BatchPayload!
  }

  type Todo {
    id: ID!
    name: String!
    isComplete: Boolean!
    user: User!
    userId: ID!
  }

  type Todos {
    todoItems: [Todo!]
    count: Int!
  }

  type BatchPayload {
    count: Int!
  }

  type User {
    id: ID!
    firstName: String!
    email: String!
    age: Int
    todos: [Todo!]!
  }
`;

module.exports = {
  typeDefs,
};
