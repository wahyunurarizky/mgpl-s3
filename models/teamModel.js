const mongoose = require('mongoose');
const slugify = require('slugify');

const teamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A team must have a name'],
    },
    shortName: {
      type: String,
      required: [true, 'A team must have a short name'],
      maxlength: 5,
    },
    logo: {
      type: String,
      default: 'defaultLogo.png',
    },
    logo_url: {
      type: String,
      default: process.env.DEFAULT_IMAGE,
    },
    logo_id: String,
    description: {
      type: String,
    },
    winGame: {
      type: Number,
      default: 0,
    },
    loseGame: {
      type: Number,
      default: 0,
    },
    winMatch: {
      type: Number,
      default: 0,
    },
    loseMatch: {
      type: Number,
      default: 0,
    },
    poin: {
      type: Number,
      default: 0,
    },
    selisihGame: {
      type: Number,
      default: 0,
    },
    selisihMatch: {
      type: Number,
      default: 0,
    },
    played: {
      type: Number,
      default: 0,
    },
    accPoin: {
      type: Number,
      default: 0,
    },
    keyPlayer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Player',
    },
    // divisi: {
    //   type: String,
    //   enum: {
    //     values: ['satu', 'dua'],
    //     message: '1 atau 2',
    //   },
    // },
    achievement: String,
    // motto: String,
    // cp: String,
    // ig: String,
    // captain: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Player',
    // },
    // key_player: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Player',
    // },
    // poin: {
    //   type: Number,
    // },
    // m_win: Number,
    // m_lose: Number,
    // match_rate: Number,
    // g_win: Number,
    // g_lose: Number,
    // rank: Number,
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
teamSchema.index({
  poin: -1,
  selisihMatch: -1,
  selisihGame: -1,
  accPoin: -1,
  winMatch: -1,
  winGame: -1,
});

teamSchema.virtual('players', {
  ref: 'Player',
  foreignField: 'team',
  localField: '_id',
});

teamSchema.pre('save', function (next) {
  // create slug sebelum di save ke db
  this.slug = slugify(this.name, { lower: true });
  next();
});

teamSchema.statics.calcSelisih = async function () {
  await this.find();
  const stats = await this.aggregate([
    {
      $project: {
        selisihGame: { $subtract: ['$winGame', '$loseGame'] },
        selisihMatch: { $subtract: ['$winMatch', '$loseMatch'] },
      },
    },
  ]);

  stats.forEach(async (e) => {
    await this.findByIdAndUpdate(e._id, {
      selisihMatch: e.selisihMatch,
      selisihGame: e.selisihGame,
    });
  });
};

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
