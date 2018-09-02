const {
  addStory,
  updateStory,
  deleteStory,
  updateAuthorName
} = require('./mutations')

const dateDesc = {
  order: [
    {
      field: 'published_at',
      direction: 'desc'
    }
  ]
}

module.exports = {
  Query: {
    stories: (r, a, { db }) => db.news.stories.find({}, dateDesc),
    storiesByAuthorSlug: (r, { slug }, { db }) =>
      db.storiesByAuthorSlug({ slug }),
    storyById: (r, { id }, { db }) => db.news.stories.findOne(id),
    storyBySlug: (r, { slug }, { db }) => db.news.stories.findOne({ slug }),
    authors: (r, a, { db }) => db.news.users.find(),
    author: (r, { id }, { db }) => db.news.users.findOne(id)
  },

  Mutation: {
    addStory,
    updateStory,
    deleteStory,
    updateAuthorName
  },

  Story: {
    author: (story, _, { db }) => db.news.users.findOne(story.author_id),
    audio: (story, _, { db }) => db.news.files.findOne(story.audio_id),
    images: (story, _, { db }) =>
      db.news.files.where('ARRAY[id] <@ $1', [story.image_ids]),
    publishedAt: story => story.published_at
  },

  Author: {
    stories: (author, _, { db }) =>
      db.news.stories.find({ author_id: author.id })
  },

  File: {
    originalFilename: file => file.og_filename
  }
}
