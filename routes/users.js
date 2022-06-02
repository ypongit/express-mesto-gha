const router = require('express').Router();
const {
  getUser,
  // createUser,
  getUsers,
  profileUpdate,
  avatarUpdate,
  getProfile,
} = require('../controllers/users');
const User = require('../models/User');
const { isAuthorized } = require('../middlewares/auth');

// router.get('/:id', /* isAuthorized,  */getUser);

// router.post('', createUser);

router.get('/', isAuthorized, getUsers);

router.patch('/me', profileUpdate);

// роут для получения информации о пользователе
router.get('/me', isAuthorized, getProfile);

router.patch('/me/avatar', avatarUpdate);

module.exports.userRouter = router;
