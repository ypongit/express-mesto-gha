const path = require('path');
const fs = require('fs').promises;
const users = require('../data.json');
const User = require('../models/User');

const getUser = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found!" });
      }

      res.status(200).send(user)
    })
    .catch(err => {
      if (err.kind === 'ObjectID') {
        return res.status(404).send({ message: 'Id is not correct!' });
      }

      res.status(500).send({ message: 'Server error' });
    });
  // console.log("typeof id ->", typeof id);
  // console.log("typeof users[0].id -> ", typeof users[0].id);
  /* const user = users.find(user => user.id === Number(id));
  if (!user) {
    return res.status(404).send({ message: "User not found!" });
  }
  res.status(200).send(user); */
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // console.log({age, name});
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Data of user are not correct!' });
  }

  User.create({ name, about, avatar })
    .then(user => {
      res.status(201).send(user);
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Data of user are not correct!' });
      }
      res.status(500).send({ message: 'Server error' });
      // console.log('err', err);
    });
  /* fs.readFile(path.resolve(__dirname, '..', 'data.json'), 'utf-8')
    .then(fileContent => {
      console.log('fileContent ->', fileContent);
      const users = JSON.parse(fileContent);

      users.push({
        id: users.length,
        name,
        age,
      });
      return users;
    })
    .then(users => fs.writeFile(path.resolve(__dirname, '..', 'data.json'), JSON.stringify(users)))
    .then(() => res.status(201).send({ message: 'User has been succesfully created!' }))
    .catch(() => res.status(500).send({message: 'Server error'})); */
};

const getUsers = (_, res) => {
  User.find({})
    .then(users => {
      res.status(200).send(users);
    })
    .catch(err => {
      () => {
        res.status(500).send( {message: 'Server error'} )}
    });
  // res.status(200).send(users);
}

module.exports = {
  getUser,
  createUser,
  getUsers
}