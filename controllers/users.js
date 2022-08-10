const Users = require('../models/user');

const ERROR_CODE = 400
const NOT_FOUND_CODE = 404
const CREATED_CODE = 201
const INTERNAL_SERVER_ERROR = 500


class NotFound extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send({ user }))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
        res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.status(CREATED_CODE).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя. ',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении пользователя. ',
        });
      } else if (err.name === 'NotFound') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара. ',
        });
      } else if (err.name === 'NotFound') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};