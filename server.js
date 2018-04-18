'use strict';
const express = require('express');
const morgan = require('morgan');
const noteRouter = require('./router/notes.router');
const { PORT } = require('./config');
//const { logger } = require('./middleware/logger');

const app = express();
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', noteRouter);
// app.get('/boom', (req, res, next) => {
//     throw new Error('!boom');
// });

app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

app.listen(PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});