const multer = require('multer');
const sharp = require('sharp');
const Team = require('../models/teamModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

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
    'divisi'
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
    'description'
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
