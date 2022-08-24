const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const cardValidator = Joi.string().hex().length(24);

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i),
  }),
}), createCard);
cardRouter.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: cardValidator,
  }),
}), deleteCard);
cardRouter.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: cardValidator,
  }),
}), likeCard);
cardRouter.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: cardValidator,
  }),
}), dislikeCard);

module.exports = cardRouter;
