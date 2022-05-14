const express = require('express');

const sponsorController = require('../controllers/sponsorControllers');

const authController = require('../controllers/authControllers');

const router = express.Router();

router
  .route('/')
  .get(sponsorController.getAllSponsor)
  .post(
    authController.protect,
    sponsorController.uploadPhoto,
    sponsorController.resizePhoto,
    sponsorController.createSponsor
  );

router.route('/:id').delete(sponsorController.deleteSponsor);

module.exports = router;
