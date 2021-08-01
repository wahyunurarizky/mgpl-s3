const express = require('express');

const newsController = require('../controllers/newsControllers');

const router = express.Router();

router
  .route('/')
  .get(newsController.getAllNews)
  .post(
    newsController.uploadPhoto,
    newsController.resizePhoto,
    newsController.createNews
  );

router.route('/:id').delete(newsController.deleteNews);

module.exports = router;
