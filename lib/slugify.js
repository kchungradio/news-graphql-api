const slugify = require('slugify')

// TODO: check slug and increment if taken
// self-referential function

module.exports = str =>
  slugify(str, {
    lower: true,
    remove: /['!"#$%&\\'()*+,\-./:;<=>?@[\\\]^_`{|}~']/g
  })
