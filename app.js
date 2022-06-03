const express = require('express');
const mongoose = require('mongoose');
// const router = require('express').Router();
const { userRouter } = require('./routes/users');
const { cardsRouter } = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');
const { isAuthorized } = require('./middlewares/auth');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

/* app.use((req, _, next) => {
  req.user = {
    // вставьте сюда _id созданного в предыдущем пункте пользователя
    _id: '6291f02272c8bf27a4122b52',
  };

  next();
});*/

app.use(express.json());

app.use('/cards', isAuthorized, cardsRouter);

app.use('/users', isAuthorized, userRouter);
// авторизация
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .pattern(/^https?:\/\/(w{3}\.)?[\w]*\.ru\/[-._~:/?#[]@!$&'()*\+,;=]*#?$/),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), createUser);
// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));
// мидлвэр для централизованной обработки ошибок
app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message || 'Что-то пошло не так' });
  }

  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
