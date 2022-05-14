const mongoose = require('mongoose');

const sponsorSchema = mongoose.Schema({
  photo: String,
  photo_url: {
    type: String,
    default: process.env.DEFAULT_IMAGE,
  },
  photo_id: String,
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);
module.exports = Sponsor;
