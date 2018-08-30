const { gql } = require('apollo-server')

module.exports = gql`
  type Story {
    id: Int!
    author: Author
    audio: File!
    images: [File!]
    title: String!
    slug: String
    description: String
    location: String
    series: String
    tags: [String!]
    publishedAt: Date
  }

  input StoryInput {
    title: String!
    audio: FileInput!
    images: [FileInput!]
    description: String
    location: String
    series: String
    tags: [String!]
    publishedAt: String
  }

  input StoryUpdateInput {
    title: String
    audio: FileUpdateInput
    images: [FileUpdateInput!]
    description: String
    location: String
    series: String
    tags: [String!]
    publishedAt: String
  }

  type Author {
    id: Int!
    name: String
    slug: String
    stories: [Story!]
  }

  type File {
    id: ID!
    filename: String!
    originalFilename: String
    mimetype: String
  }

  input FileInput {
    filename: String!
    originalFilename: String!
  }

  input FileUpdateInput {
    id: ID
    filename: String!
    originalFilename: String!
  }

  scalar Date

  type Query {
    stories: [Story]
    storyById(id: Int!): Story
    storyBySlug(slug: String!): Story
    storiesByAuthorSlug(slug: String!): [Story]
    authors: [Author]
    author(id: Int!): Author
  }

  type Mutation {
    addStory(input: StoryInput!): Story
    updateStory(id: Int!, input: StoryUpdateInput!): Story
    deleteStory(id: Int!): Story
  }
`
