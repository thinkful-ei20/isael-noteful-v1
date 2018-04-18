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

module.exports = router;