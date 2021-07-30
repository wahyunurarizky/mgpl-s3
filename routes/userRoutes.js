const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers');
// userssssss

const router = express.Router();

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getOneUser)
  .patch(userController.updateUserData)
  .delete(userController.deleteUser);

router.patch('/:id/updatePassword', authController.updateUserPassword);
module.exports = router;
