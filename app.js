const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, Joi, celebrate } = require('celebrate');
const users = require('./routes/users');
const cards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { INTERNAL_SERVER_ERROR } = require('./codes');
const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/', users);
app.use('/', cards);
app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});
app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
