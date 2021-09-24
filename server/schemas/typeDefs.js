const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Parent {
    _id: ID
    username: String
    email: String
    childCount: Int
    children: [Child]
  }

  type Child {
    _id: ID
    childName: String
    dateOfBirth: String
    passcode: String
    parentUsername: String
    chores: [Chore]
    choreCount: Int
  }

  type Chore {
    _id: ID
    title: String
    instructions: String
    createdAt: String
    createdBy: String
    isDone: Boolean
    value: Float
  }

  type Auth {
    token: ID!
    parent: Parent
  }
  type Query {
    me: Parent
    parents: [Parent]
    parent(username: String!): Parent
    children(childName: String): [Child]
    child(_id: ID!): Child
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    loginChild(parentUsername: String!, childName: String!, passcode: String!): Auth
    addParent(email: String!, password: String!, username: String!): Auth
    addChild(childName: String!, dateOfBirth: String!, passcode:String!): Child
    addChore(childId: ID!, title: String!, instructions: String!, value: Float!): Child
  }
`;

module.exports = typeDefs;