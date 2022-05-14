const axios = require('axios');
const Schedule = require('../models/scheduleModels');
const Team = require('../models/teamModel');
const News = require('../models/newsModel');
const Streamer = require('../models/streamerModel');
const catchAsync = require('../utils/catchAsync');
const Sponsor = require('../models/sponsorModel');

exports.getOverview = catchAsync(async (req, res) => {
  const resp = await axios({
    method: 'get',
    url: `${req.protocol}://${req.get(
      'host'
    )}/api/v1/teams?sort=-poin,-selisihMatch,-selisihGame,-accPoin,-winMatch,-winGame,name&limit=5`,
  });
  const news = await News.find();
  const sponsors = await Sponsor.find();
  const streamers = await Streamer.find();
  const schedules = await Schedule.find({ finish: false });
  res.status(200).render('main/overview', {
    teams: resp.data.data.docs,
    schedules,
    news,
    sponsors,
    streamers,
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
  };
  // let filter = {};
  const schedules = await Schedule.find(filt);
  res.status(200).render('main/schedules', {
    schedules,
    active: req.query.day,
    day: schedules.length * 2 - 1,
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
