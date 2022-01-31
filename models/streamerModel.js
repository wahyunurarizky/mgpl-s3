const mongoose = require('mongoose');

const streamerSchema = mongoose.Schema({
  photo: String,
  photo_url: {
    type: String,
    default: process.env.DEFAULT_IMAGE,
  },
  photo_id: String,
});

const Streamer = mongoose.model('Streamer', streamerSchema);
module.exports = Streamer;
