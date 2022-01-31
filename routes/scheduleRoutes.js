const express = require('express');

const router = express.Router();
const scheduleControllers = require('../controllers/scheduleControllers');
// const authController = require('../controllers/authControllers');
//

router.route('/').get(scheduleControllers.getAllSchedules);
// .post(teamControllers.createTeam);
router
  .route('/:id')
  .get(scheduleControllers.getOneSchedule)
  .patch(scheduleControllers.updateSchedules);
// .delete(teamControllers.deleteTeam);

router.route('/day/:day').patch(scheduleControllers.updateStartDate);

module.exports = router;
