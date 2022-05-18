const router = require('express').Router();
const {
  getUser,
  createUser,
  getUsers,
} = require('../controllers/users')

router.get('/:id', getUser);

router.post('', createUser);

router.get('/', getUsers);

module.exports.userRouter = router;
