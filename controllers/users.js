const Users = require('../models/user');
const codes = require('../codes');

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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.status(codes.CREATED).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codes.ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(codes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
