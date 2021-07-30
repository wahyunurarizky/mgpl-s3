const multer = require('multer');
const sharp = require('sharp');
const Player = require('../models/playerModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.setTeamId = (req, res, next) => {
  // nested routes /tours/asdads/reviws
  if (!req.body.team) req.body.team = req.params.teamId;

  next();
};
exports.createPlayer = factory.createOne(
  Player,
  'nick',
  'idGame',
  'name',
  'team',
  'instagram'
);
exports.getAllPlayer = factory.getAll(Player, { path: 'team' });
exports.getOnePlayer = factory.getOne(Player);
exports.updatePlayer = factory.updateOne(Player);
exports.deletePlayer = factory.deleteOne(Player);

exports.uploadPhoto = upload.single('photo');
exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `player-${Date.now()}.png`;

  await sharp(req.file.buffer)
    .resize(600, 800)
    .toFormat('png')
    .toFile(`public/img/players/${req.file.filename}`);

  next();
});

exports.deleteByTeam = catchAsync(async (req, res, next) => {
  if (!req.params.teamId) {
    return next(new AppError('something went wrong', 400));
  }
  await Player.deleteMany({ team: req.params.teamId });
  res.status(204).json({
    status: 'success',
  });
});
