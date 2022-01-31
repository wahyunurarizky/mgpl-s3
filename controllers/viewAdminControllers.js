const Schedule = require('../models/scheduleModels');
const Team = require('../models/teamModel');
const Streamer = require('../models/streamerModel');
const catchAsync = require('../utils/catchAsync');
const News = require('../models/newsModel');

exports.manageStreamer = catchAsync(async (req, res, next) => {
  const streamers = await Streamer.find();

  res.status(200).render('admin/manageStreamer.pug', {
    title: 'manage teams',
    streamers,
  });
});
exports.manageNews = catchAsync(async (req, res, next) => {
  const news = await News.find();

  res.status(200).render('admin/manageNews.pug', {
    title: 'manage teams',
    news,
  });
});
exports.manageTeams = catchAsync(async (req, res, next) => {
  const teams = await Team.find();

  res.status(200).render('admin/manageTeams.pug', {
    title: 'manage teams',
    teams,
  });
});

exports.managePlayers = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id).populate('players');
  res.status(200).render('admin/managePlayers.pug', {
    title: 'manage players',
    team,
  });
});

exports.manageSchedules = catchAsync(async (req, res, next) => {
  const schedules = await Schedule.find()
    .populate({
      path: 't1',
    })
    .populate({
      path: 't2',
    });
  res.status(200).render('admin/manageSchedule', {
    title: 'manage Schedule',
    schedules,
  });
});

exports.manageDay = catchAsync(async (req, res, next) => {
  const schedules = await Schedule.find({ head: true });
  res.status(200).render('admin/manageDay', {
    title: 'manage Day',
    schedules,
  });
});

exports.start = (req, res) => {
  res.status(200).render('admin/start');
};
