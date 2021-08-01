const express = require('express');

const streamerController = require('../controllers/streamerControllers');

const router = express.Router();

router
  .route('/')
  .get(streamerController.getAllStreamer)
  .post(
    streamerController.uploadPhoto,
    streamerController.resizePhoto,
    streamerController.createStreamer
  );

router.route('/:id').delete(streamerController.deleteStreamer);

module.exports = router;
