const multer = require('multer');
const sharp = require('sharp');
const streamifier = require('streamifier');

const Streamer = require('../models/streamerModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const cloudinary = require('../utils/cloudinary');

exports.getAllStreamer = factory.getAll(Streamer);
exports.deleteStreamer = factory.deleteOne(Streamer);

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload only images', 400), false);
  }
};

exports.createStreamer = factory.createOne(Streamer, 'photo_url', 'photo_id');
const uploadMem = multer({
  storage: multer.memoryStorage({}),
  fileFilter: multerFilter,
});

exports.uploadPhoto = uploadMem.fields([{ name: 'photo', maxCount: 1 }]);

const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });

// upload.array()
exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (req.files === undefined) {
    return next();
  }
  if (req.files.photo) {
    const logoSharp = await sharp(req.files.photo[0].buffer).toBuffer();

    const logoCloud = await streamUpload(logoSharp);

    req.body.photo_id = logoCloud.public_id;
    req.body.photo_url = logoCloud.secure_url;
  }

  next();
});
