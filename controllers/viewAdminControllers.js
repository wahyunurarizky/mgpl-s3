const Player = require('../models/playerModel');
const Schedule = require('../models/scheduleModels');
const Team = require('../models/teamModel');
const catchAsync = require('../utils/catchAsync');

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

exports.start = (req, res) => {
  res.status(200).render('admin/start');
};
