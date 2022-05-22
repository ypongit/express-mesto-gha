const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/users');
const { cardsRouter } = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, _, next) => {
  req.user = {
    // вставьте сюда _id созданного в предыдущем пункте пользователя
    _id: '6284e5caf459e18331bf63ad',
  };

  next();
});

app.use(express.json());

app.use('/cards', cardsRouter);

app.use('/users', userRouter);

app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
