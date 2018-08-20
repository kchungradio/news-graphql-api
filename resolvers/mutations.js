/* eslint-disable camelcase */

const { ApolloError } = require('apollo-server')

const slugify = require('../lib/slugify')

const APP_NAME = 'graphql-server'

async function createStory (_, { input }, { db }) {
  // TODO input.author_id = ctx.jwt.sub

  input.slug = slugify(input.title)

  input.audio_id = await insertFile(db, input.audio)
  delete input.audio

  if (input.images) {
    input.image_ids = await insertFiles(db, input.images)
    delete input.images
  }

  return db.news.stories.insert({ ...input, created_by: APP_NAME })
}

async function updateStory (_, { id, input }, { db }) {
  const story = await db.news.stories.findOne(id)
  // TODO make sure ctx.jwt.sub matches story.author_id
  if (!story) throw new ApolloError(`Story doesn't exist`, 404)

  if (input.title && input.title !== story.title) {
    input.slug = slugify(input.title)
  }

  return db.news.stories.update(id, { ...input, updated_by: APP_NAME })
}

async function updateStoryAudio (_, { id, input }, { db }) {
  const story = await db.news.stories.findOne(id)
  // TODO make sure ctx.jwt.sub matches story.author_id
  if (!story) throw new ApolloError(`Story doesn't exist`, 404)

  const audio_id = await insertFile(db, input)
  const updatedStory = await db.news.stories.update(id, { audio_id })
  db.news.files.destroy(story.audio_id)

  return updatedStory
}

async function updateStoryImages (_, { id, input }, { db }) {
  const story = await db.news.stories.findOne(id)
  // TODO make sure ctx.jwt.sub matches story.author_id
  if (!story) throw new ApolloError(`Story doesn't exist`, 404)

  const image_ids = await insertFiles(db, input)
  const updatedStory = await db.news.stories.update(id, { image_ids })
  db.news.files.destroy({ id: story.image_ids })

  return updatedStory
}

async function deleteStory (_, { id }, { db }) {
  const story = await db.news.stories.findOne(id)
  // TODO make sure ctx.jwt.sub matches story.author_id
  if (!story) throw new ApolloError(`Story doesn't exist`, 404)

  // delete story and files, in that order
  const deletedStory = await db.news.stories.destroy(id)
  const fileIds = [story.audio_id, ...story.image_ids]
  await db.news.files.destroy({ id: fileIds })

  return deletedStory
}

const insertFile = (db, file) =>
  db.news.files.insert({ ...file, created_by: APP_NAME }).then(res => res.id)

const insertFiles = (db, files) =>
  Promise.all(files.map(file => insertFile(db, file)))

module.exports = {
  createStory,
  updateStory,
  updateStoryAudio,
  updateStoryImages,
  deleteStory
}
