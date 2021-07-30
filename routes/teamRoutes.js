const express = require('express');

const router = express.Router();
const teamControllers = require('../controllers/teamControllers');
const authController = require('../controllers/authControllers');
const playerRoutes = require('./playerRoutes');

router.use('/:teamId/players', playerRoutes);

router
  .route('/')
  .get(teamControllers.getAllTeams)
  .post(
    authController.protect,
    teamControllers.uploadTeamLogo,
    teamControllers.resizeTeamLogo,
    teamControllers.createTeam
  );

router
  .route('/:id')
  .get(teamControllers.getOneTeam)
  .patch(
    authController.protect,
    teamControllers.uploadTeamLogo,
    teamControllers.resizeTeamLogo,
    teamControllers.updateTeam
  )
  .delete(authController.protect, teamControllers.deleteTeam);

module.exports = router;
