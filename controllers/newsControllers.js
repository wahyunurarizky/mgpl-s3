const multer = require('multer');
const sharp = require('sharp');
const News = require('../models/newsModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllNews = factory.getAll(News);
exports.deleteNews = factory.deleteOne(News);

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

exports.createNews = factory.createOne(News, 'photo');

exports.uploadPhoto = upload.single('photo');
exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `news-${Date.now()}.png`;

  await sharp(req.file.buffer)
    .resize(1000, 600)
    .toFormat('png')
    .toFile(`public/img/news/${req.file.filename}`);

  next();
});
