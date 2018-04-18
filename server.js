'use strict';
const express = require('express');
const data = require('./db/notes');
const simDB = require('./db/simDB');
const morgan = require('morgan');
const { PORT } = require('./config');
const { logger } = require('./middleware/logger');
const notes = simDB.initialize(data);
const app = express();
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/notes', (req,res, next) => { 
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    //console.log(list);
    if(list.length === 0  || err){
      return next(err);
    }
    res.json(list);
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;
    
  notes.find(id, (err, item) =>{
    if(item === undefined || err){
      return next(err);
    }
    res.json(item);
  });

  //res.json(data.find(item => item.id === Number(req.params.id)));
});

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;
  //console.log(id);
  //console.log(req.body);
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];
  
  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  //console.log(updateObj);
  notes.update(id, updateObj, (err, item) => {
    if (Object.keys(updateObj).length === 0 || err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

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