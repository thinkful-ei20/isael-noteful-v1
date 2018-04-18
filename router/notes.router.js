'use strict';
const simDB = require('../db/simDB');
const data = require('../db/notes');
const notes = simDB.initialize(data);

const express = require('express');
const router = express.Router();


router.get('/notes', (req,res, next) => { 
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    //console.log(list);
    if(list.length === 0  || err){
      return next(err);
    }
    res.json(list);
  });
});

router.get('/notes/:id', (req, res, next) => {
  const { id } = req.params;
    
  notes.find(id, (err, item) =>{
    if(item === undefined || err){
      return next(err);
    }
    res.json(item);
  });

  //res.json(data.find(item => item.id === Number(req.params.id)));
});

router.put('/notes/:id', (req, res, next) => {
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

router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  if(!newItem.title){
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if(err){
      return next(err);
    }
    if(item){
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    }else{
      next();
    }
  });

});

router.delete('/notes/:id', (req, res, next) => {
  let {id} = req.params;
  //console.log(notes.data[])

  notes.delete(id, err => {
    if(err) return next(err);
    
    //console.log(err === null);
    if(err === null){
      res.status(204).end();
    }
  });
});

module.exports = router;