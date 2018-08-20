const {
  createStory,
  updateStory,
  updateStoryAudio,
  updateStoryImages,
  deleteStory
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
    story: (r, { id }, { db }) => db.news.stories.findOne(id),
    authors: (r, a, { db }) => db.news.users.find(),
    author: (r, { id }, { db }) => db.news.users.findOne(id)
  },

  Mutation: {
    createStory,
    updateStory,
    updateStoryAudio,
    updateStoryImages,
    deleteStory
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
    ogFilename: file => file.og_filename
  }
}
