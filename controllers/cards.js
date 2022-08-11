const Card = require('../models/card');
const codes = require('../codes');

class NotFound extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(codes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(codes.CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codes.ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(codes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(codes.ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFound') {
        res.status(codes.NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(codes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(codes.NOT_FOUND).send({ message: 'Карточка не существует' });
      } else if (err.name === 'CastError') {
        res.status(codes.ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(codes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(codes.ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFound') {
        res.status(codes.NOT_FOUND).send({ message: 'Карточка не существует' });
      } else {
        res.status(codes.INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
