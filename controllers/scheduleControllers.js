const multer = require('multer');
const sharp = require('sharp');
const Schedule = require('../models/scheduleModels');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');
const Team = require('../models/teamModel');
const AppError = require('../utils/appError');

exports.getAllSchedules = factory.getAll(Schedule);
exports.getOneSchedule = factory.getOne(Schedule, [
  { path: 'mvp' },
  { path: 't1' },
  { path: 't2' },
]);
exports.updateSchedules = factory.updateOne(Schedule);
// exports.updateSchedules = catchAsync(async (req, res, next) => {
//   const schedule = await Schedule.findById(req.params.id);

//   schedule.win = req.body.win;
//   schedule.lose = req.body.lose;
//   schedule.score = req.body.score;
//   schedule.mvp = req.body.mvp;
//   schedule.screenshoots = req.body.screenshoots;
//   schedule.finish = req.body.finish;

//   schedule.save();
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadScreenshoots = upload.array('screenshoots', 3);

exports.resizeScreenshoots = catchAsync(async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  // console.log('aaaaa', req.files.screenshoots);

  req.body.screenshoots = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(req.files[i].buffer)
        .resize(1920, 1080)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/ss/${filename}`);

      req.body.screenshoots.push(filename);
    })
  );

  next();
});

exports.start = catchAsync(async (req, res, next) => {
  await Schedule.deleteMany();
  const teams = await Team.find();
  let day = 1;
  for (let i = 1; i < teams.length; i++) {
    await Schedule.create({
      day,
      t1: teams[0].id,
      t2: teams[i].id,
      head: true,
    });
    for (let j = 1; j < teams.length / 2; j++) {
      let a = teams.length - j - 1 + i;
      let b = i + j;

      if (a > teams.length - 1) a -= teams.length - 1;
      if (b > teams.length - 1) b -= teams.length - 1;

      await Schedule.create({
        day,
        t1: teams[a].id,
        t2: teams[b].id,
      });
    }

    day++;
    // if (i % 2 != 0) {
    //   if (i == 1) {
    //     startDate += 86400000;
    //   } else {
    //     startDate += 81000000;
    //   }
    //   day++;
    //   sesi = 'A';
    // } else {
    //   startDate += 5400000;
    //   sesi = 'B';
    // }
  }
  res.status(200).redirect('/panel-admin/manage-schedule');
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  await Schedule.deleteMany();

  res.redirect('/panel-admin/manage-schedule');
});

exports.updateStartDate = catchAsync(async (req, res, next) => {
  const s = await Schedule.updateMany(
    { day: req.params.day },
    { startDate: new Date(req.body.startDate) }
  );
  res.status(200).json({
    status: 'success',
    results: s.length,
    data: null,
  });
});
