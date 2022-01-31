const express = require('express');

const streamerController = require('../controllers/streamerControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

router
  .route('/')
  .get(streamerController.getAllStreamer)
  .post(
    authController.protect,
    streamerController.uploadPhoto,
    streamerController.resizePhoto,
    streamerController.createStreamer
  );

router.route('/:id').delete(streamerController.deleteStreamer);

module.exports = router;
