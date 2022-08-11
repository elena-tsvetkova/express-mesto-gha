const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');
const codes = require('./codes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = { _id: '62f42dd85a29f7fc5dad554e' };
  next();
});

app.use('/', users);
app.use('/', cards);
app.use('*', (req, res) => {
  res.status(codes.NOT_FOUND).send({ message: 'Страница не найдена' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
