
const express = require('express');
// const path = require('path');
// const fs = require('fs').promises;
const mongoose = require('mongoose');
// const users = require('./data.json');
const { userRouter } = require('./routes/users');
const { cardsRouter } = require('./routes/cards');
const Card = require('./models/Card');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use('/cards', cardsRouter);

app.use('/users', userRouter);

app.get('/', (req, res) => {
  // console.log('Да пребудет с вами сила!');
  res.status(200).send('<h1>Здесь могла быть ваша реклама!</h1>');
});

app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

/* app.use('/cards', (req, res, next) => {
  req.user = {
    // вставьте сюда _id созданного в предыдущем пункте пользователя
    _id: '6284e5caf459e18331bf63ad',
  };

  next();
});
 */
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
