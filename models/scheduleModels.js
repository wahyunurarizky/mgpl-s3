const mongoose = require('mongoose');
const Team = require('./teamModel');
const Player = require('./playerModel');

const scheduleSchema = mongoose.Schema({
  t1: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
  },
  t2: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
  },
  sesi: String,
  startDate: Date,
  win: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
  },
  lose: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
  },
  score: {
    type: String,
    enum: {
      values: ['full', 'half'],
      message: 'scoreo antara full dan half',
    },
  },
  mvp: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Player',
    },
  ],
  screenshoots: [String],
  finish: {
    type: Boolean,
    default: false,
  },
  poin: {
    type: Number,
    default: 0,
  },
  poinTimWin: {
    type: Number,
    default: 0,
  },
  poinTimLose: {
    type: Number,
    default: 0,
  },
  // divisi: {
  //   type: String,
  //   enum: {
  //     values: ['satu', 'dua'],
  //     message: '1 atau 2',
  //   },
  // },
  day: Number,
});

scheduleSchema.statics.calcWin = async function () {
  await Team.updateMany(
    {},
    {
      $set: {
        winGame: 0,
        loseGame: 0,
        winMatch: 0,
        loseMatch: 0,
        poin: 0,
        played: 0,
        accPoin: 0,
      },
    }
  );

  const statsWin = await this.aggregate([
    {
      $match: { finish: true },
    },
    {
      $group: {
        _id: '$win',
        nWinMatch: { $sum: 1 },
        nWinGame: {
          $sum: 2,
        },
        nLoseGame: {
          $sum: {
            $cond: [{ $eq: ['$score', 'full'] }, 0, 1],
          },
        },
        nPoin: {
          $sum: {
            $cond: [{ $eq: ['$score', 'full'] }, 3, 2],
          },
        },
        nPlayed: { $sum: 1 },
        nAccPoin: { $sum: '$poinTimWin' },
      },
    },
  ]);
  // Team.findByIdAndUpdate(idplayer, { mvp: nmvp });

  if (statsWin.length > 0) {
    statsWin.forEach(async (s) => {
      // console.log('wkwkwk');
      await Team.findByIdAndUpdate(s._id, {
        winMatch: s.nWinMatch,
        winGame: s.nWinGame,
        loseGame: s.nLoseGame,
        poin: s.nPoin,
        played: s.nPlayed,
        accPoin: s.nAccPoin,
      });
    });
  }
  const statsLose = await this.aggregate([
    {
      $match: { finish: true },
    },
    {
      $group: {
        _id: '$lose',
        nLoseMatch: { $sum: 1 },
        nWinGame: {
          $sum: {
            $cond: [{ $eq: ['$score', 'full'] }, 0, 1],
          },
        },
        nLoseGame: {
          $sum: 2,
        },
        nPoin: {
          $sum: {
            $cond: [{ $eq: ['$score', 'full'] }, 0, 1],
          },
        },
        nPlayed: { $sum: 1 },
        nAccPoin: { $sum: '$poinTimLose' },
      },
    },
  ]);

  console.log('statWins', statsWin);
  console.log('statLLose', statsLose);

  if (statsLose.length > 0) {
    statsLose.forEach(async (s) => {
      // console.log('wkwkwk');
      await Team.findByIdAndUpdate(s._id, {
        $inc: {
          loseMatch: s.nLoseMatch,
          loseGame: s.nLoseGame,
          winGame: s.nWinGame,
          poin: s.nPoin,
          played: s.nPlayed,
          accPoin: s.nAccPoin,
        },
      });
    });
  }
};
scheduleSchema.statics.calcMvp = async function () {
  await Player.updateMany(
    {},
    {
      $set: {
        mvp: 0,
      },
    }
  );
  const statsMvp = await this.aggregate([
    {
      $match: {
        finish: true,
      },
    },
    {
      $unwind: '$mvp',
    },
    {
      $group: {
        _id: '$mvp',
        mvp: { $sum: 1 },
      },
    },
  ]);

  if (statsMvp.length > 0) {
    statsMvp.forEach(async (s) => {
      await Player.findByIdAndUpdate(s._id, { mvp: s.mvp });
    });
  }
};
scheduleSchema.pre('find', function (next) {
  this.populate({
    path: 't1',
  }).populate({
    path: 't2',
  });
  next();
});
scheduleSchema.pre(/^findOneAnd/, async function (next) {
  // console.log('kedua', this);
  this.sch = await this.findOne(); //menjalankan atau meng execute query. dan menghasilkan document
  // console.log(this.sch);
  next();
});
scheduleSchema.post(/^findOneAnd/, async function () {
  const doc = await this.findOne();
  console.log(doc);
  await doc.constructor.calcWin();
  await doc.constructor.calcMvp();
  await Team.calcSelisih();
  await Player.keyPlayer();
});

// scheduleSchema.post(/^findOneAnd/, async function () {
//   await
// });

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
