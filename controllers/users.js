const Users = require('../models/user');
const codes = require('../codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Conflict, BadRequest, NotFound} = require("../errors");


module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send({ user }))
    .catch(() => {
      res.status(codes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(codes.NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(codes.ERROR).send({ message: 'Пользователь не найден' });
      } else {
        res.status(codes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {name, about, avatar, email, password} = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => Users.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      const userData = {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      };
      res.status(codes.CREATED).send({userData})
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest());
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codes.ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFound') {
        res.status(codes.NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(codes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codes.ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFound') {
        res.status(codes.NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(codes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};