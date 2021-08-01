const mongoose = require('mongoose');

const streamerSchema = mongoose.Schema({
  photo: String,
});

const Streamer = mongoose.model('Streamer', streamerSchema);
module.exports = Streamer;
