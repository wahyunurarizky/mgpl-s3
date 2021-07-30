const express = require('express');

const playerController = require('../controllers/playerControllers');

const router = express.Router({ mergeParams: true });
// const authController = require('../controllers/authControllers');

router.use(playerController.setTeamId);

router
  .route('/')
  .get(playerController.getAllPlayer)
  .post(
    playerController.uploadPhoto,
    playerController.resizePhoto,
    playerController.setTeamId,
    playerController.createPlayer
  )
  .delete(playerController.deleteByTeam);

router
  .route('/:id')
  .get(playerController.getOnePlayer)
  .patch(
    // playerController.uploadPlayerLogo,
    // playerController.resizePlayerLogo,
    playerController.updatePlayer
  )
  .delete(playerController.deletePlayer);

module.exports = router;
