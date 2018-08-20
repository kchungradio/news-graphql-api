const { gql } = require('apollo-server')

module.exports = gql`
  type Story {
    id: ID!
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
    author_id: Int! # TODO delete
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
    description: String
    location: String
    series: String
    tags: [String!]
    publishedAt: String
  }

  type Author {
    id: ID!
    name: String
    slug: String
    stories: [Story!]
  }

  type File {
    id: ID!
    filename: String!
    ogFilename: String
    mimetype: String
  }

  input FileInput {
    filename: String!
    ogFilename: String!
  }

  scalar Date

  type Query {
    stories: [Story]
    story(id: Int!): Story
    storiesByAuthorSlug(slug: String!): [Story]
    authors: [Author]
    author(id: Int!): Author
  }

  type Mutation {
    addStory(input: StoryInput!): Story
    updateStory(id: Int!, input: StoryUpdateInput!): Story
    updateStoryAudio(id: Int!, input: FileInput!): Story
    updateStoryImages(id: Int!, input: [FileInput!]!): Story
    deleteStory(id: Int!): Story
  }
`
