const axios = require('axios');
const Player = require('../models/playerModel');
const Schedule = require('../models/scheduleModels');
const Team = require('../models/teamModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const resp = await axios({
    method: 'get',
    url: `${req.protocol}://${req.get(
      'host'
    )}/api/v1/teams?sort=-poin,-selisihMatch,-selisihGame,-accPoin,-winMatch,-winGame,name&limit=5`,
  });
  const schedules = await Schedule.find({ finish: false });
  res.status(200).render('main/overview', {
    teams: resp.data.data.docs,
    schedules,
  });
});

exports.getTeamView = catchAsync(async (req, res) => {
  const team = await Team.findOne({ slug: req.params.slug }).populate([
    { path: 'players' },
    { path: 'keyPlayer' },
  ]);

  res.status(200).render('main/team', {
    team,
  });
});

exports.getScheduleView = catchAsync(async (req, res, next) => {
  if (!req.query.day) req.query.day = 1;
  const filt = {
    day: req.query.day,
    sesi: 'A',
  };
  // let filter = {};
  const schedulesA = await Schedule.find(filt);

  filt.sesi = 'B';
  const schedulesB = await Schedule.find(filt);

  res.status(200).render('main/schedules', {
    schedulesA,
    schedulesB,
    active: req.query.day,
    day: schedulesA.length,
  });
});

exports.getTeamsView = catchAsync(async (req, res, next) => {
  const teams = await Team.find();
  res.status(200).render('main/teams', {
    teams,
  });
});

exports.getStandingsView = catchAsync(async (req, res, next) => {
  const resp = await axios({
    method: 'get',
    url: `${req.protocol}://${req.get(
      'host'
    )}/api/v1/teams?sort=-poin,-selisihMatch,-selisihGame,-accPoin,-winMatch,-winGame,name`,
  });

  res.status(200).render('main/standings', {
    teams: resp.data.data.docs,
  });
});

exports.getMvpView = catchAsync(async (req, res, next) => {
  const resp = await axios({
    method: 'get',
    url: `${req.protocol}://${req.get(
      'host'
    )}/api/v1/players?sort=-mvp,nick&limit=10`,
  });

  const players = resp.data.data.docs;

  res.status(200).render('main/mvp', {
    players,
  });
});

exports.getAboutView = (req, res) => {
  res.status(200).render('main/about');
};
