const express = require('express');

const newsController = require('../controllers/newsControllers');

const authController = require('../controllers/authControllers');

const router = express.Router();

router
  .route('/')
  .get(newsController.getAllNews)
  .post(
    authController.protect,
    newsController.uploadPhoto,
    newsController.resizePhoto,
    newsController.createNews
  );

router.route('/:id').delete(newsController.deleteNews);

module.exports = router;
