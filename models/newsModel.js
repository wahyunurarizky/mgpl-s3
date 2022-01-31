const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
  photo: String,
  photo_url: {
    type: String,
    default: process.env.DEFAULT_IMAGE,
  },
  photo_id: String,
});

const News = mongoose.model('News', newsSchema);
module.exports = News;
