const multer = require('multer');
const sharp = require('sharp');
const Streamer = require('../models/streamerModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllStreamer = factory.getAll(Streamer);
exports.deleteStreamer = factory.deleteOne(Streamer);

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

exports.createStreamer = factory.createOne(Streamer, 'photo');

exports.uploadPhoto = upload.single('photo');
exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `streamer-${Date.now()}.png`;

  await sharp(req.file.buffer)
    .resize(1000, 600)
    .toFormat('png')
    .toFile(`public/img/streamer/${req.file.filename}`);

  next();
});
