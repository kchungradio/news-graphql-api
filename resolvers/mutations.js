/* eslint-disable camelcase */

const { ApolloError } = require('apollo-server')

const slugify = require('../lib/slugify')

const APP_NAME = 'graphql-server'

async function addStory (_, { input }, { db, user }) {
  if (!user) throw new ApolloError('Unauthorized', 401)

  input.author_id = user.id
  input.slug = slugify(input.title)
  input.audio_id = await insertFile(db, input.audio)
  if (input.images) {
    input.image_ids = await insertFiles(db, input.images)
  }

  return db.news.stories.insert({ ...input, created_by: APP_NAME })
}

async function updateStory (_, { id, input }, { db, user }) {
  if (!user) throw new ApolloError('Unauthorized', 401)

  const story = await db.news.stories.findOne(id)

  if (!story) throw new ApolloError(`Story doesn't exist`, 404)
  if (user.id !== story.author_id) throw new ApolloError('Unauthorized', 401)

  if (input.title && input.title !== story.title) {
    input.slug = slugify(input.title)
  }

  if (input.audio && !input.audio.id) {
    input.audio_id = await insertFile(db, input.audio)
  }

  if (input.images) {
    const existingImages = input.images.filter(i => i.id)
    const newImages = input.images.filter(i => !i.id)

    input.image_ids = existingImages.map(i => i.id)
    const newIds = await insertFiles(db, newImages)
    input.image_ids.concat(newIds)
  }

  return db.news.stories.update(id, { ...input, updated_by: APP_NAME })
}

async function deleteStory (_, { id }, { db, user }) {
  if (!user) throw new ApolloError('Unauthorized', 401)

  const story = await db.news.stories.findOne(id)

  if (!story) throw new ApolloError(`Story doesn't exist`, 404)
  if (user.id !== story.author_id) throw new ApolloError('Unauthorized', 401)

  // delete story and files, in that order
  const deletedStory = await db.news.stories.destroy(id)
  const imageIds = story.image_ids ? story.image_ids : []
  const fileIds = [story.audio_id, ...imageIds]
  await db.news.files.destroy({ id: fileIds })

  return deletedStory
}

const insertFile = (db, file) =>
  db.news.files
    .insert({
      ...file,
      og_filename: file.originalFilename,
      created_by: APP_NAME
    })
    .then(res => res.id)

const insertFiles = (db, files) =>
  Promise.all(files.map(file => insertFile(db, file)))

module.exports = {
  addStory,
  updateStory,
  deleteStory
}
