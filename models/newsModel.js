const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
  photo: String,
});

const News = mongoose.model('News', newsSchema);
module.exports = News;
