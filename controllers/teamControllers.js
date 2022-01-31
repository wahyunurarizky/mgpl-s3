const multer = require('multer');
const sharp = require('sharp');
const streamifier = require('streamifier');

const Team = require('../models/teamModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');
const cloudinary = require('../utils/cloudinary');

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

exports.getAllTeams = factory.getAll(Team);

exports.getOneTeam = factory.getOne(Team, { path: 'players' });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.createTeam = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'name',
    'shortName',
    'achievement',
    'description',
    'logo_id',
    'logo_url'
  );

  if (req.file) filteredBody.logo = req.file.filename;
  const team = await Team.create(filteredBody);
  res.status(201).json({
    status: 'success',
    data: {
      team,
    },
  });
});

exports.updateTeam = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'name',
    'shortName',
    'achievement',
    'description',
    'logo_id',
    'logo_url'
  );
  if (req.file) filteredBody.logo = req.file.filename;
  const updatedTeam = await Team.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedTeam) {
    return next(new AppError('no teams found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      team: updatedTeam,
    },
  });
});
exports.deleteTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) {
    return next(new AppError('no teams found with that id', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.uploadTeamLogo = upload.single('logo');

exports.resizeTeamLogo = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `logo-${Date.now()}.png`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('png')
    .toFile(`public/img/teams/${req.file.filename}`);

  next();
});

// asdasdas

const uploadMem = multer({
  storage: multer.memoryStorage({}),
  fileFilter: multerFilter,
});

exports.uploadTeamImages = uploadMem.fields([{ name: 'logo', maxCount: 1 }]);

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
exports.resizeTeamImages = catchAsync(async (req, res, next) => {
  if (req.files === undefined) {
    return next();
  }
  if (req.files.logo) {
    const logoSharp = await sharp(req.files.logo[0].buffer)
      .resize(500, 500)
      .toBuffer();

    const logoCloud = await streamUpload(logoSharp);

    req.body.logo_id = logoCloud.public_id;
    req.body.logo_url = logoCloud.secure_url;
  }

  next();
});
