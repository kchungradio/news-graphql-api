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
    published_at: Date
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
    published_at: String
  }

  input StoryUpdateInput {
    title: String
    description: String
    location: String
    series: String
    tags: [String!]
    published_at: String
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
    og_filename: String
    mimetype: String
  }

  input FileInput {
    filename: String!
    og_filename: String!
  }

  scalar Date

  type Query {
    stories: [Story]
    story(id: Int!): Story
    authors: [Author]
    author(id: Int!): Author
  }

  type Mutation {
    createStory(input: StoryInput!): Story
    updateStory(id: Int!, input: StoryUpdateInput!): Story
    updateStoryAudio(id: Int!, input: FileInput!): Story
    updateStoryImages(id: Int!, input: [FileInput!]!): Story
    deleteStory(id: Int!): Story
  }
`
