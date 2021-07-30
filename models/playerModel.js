const mongoose = require('mongoose');
const Team = require('./teamModel');

const playerSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'you must have a name'],
  },
  nick: {
    type: String,
    require: [true, 'you must have a nick'],
  },
  photo: {
    type: String,
    default: 'default.png',
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
  },
  idGame: String,
  mvp: {
    type: Number,
    default: 0,
  },
  instagram: String,
  motto: String,
});

playerSchema.statics.keyPlayer = async function () {
  console.log('wkwkwk');
  const statsKey = await this.aggregate([
    {
      $group: {
        _id: '$team',
        key: { $max: '$mvp' },
      },
    },
  ]);
  console.log(statsKey);
  statsKey.forEach(async (s) => {
    const keyPlayer = await this.findOne({ team: s._id, mvp: s.key });
    await Team.findByIdAndUpdate(s._id, { keyPlayer: keyPlayer.id });
  });
};

playerSchema.post('save', async function () {
  await this.constructor.keyPlayer();
});

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;
