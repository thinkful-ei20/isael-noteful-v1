'use strict';
const simDB = require('../db/simDB');
const data = require('../db/notes');
const notes = simDB.initialize(data);

const express = require('express');
const router = express.Router();


router.get('/notes', (req,res, next) => { 
  const { searchTerm } = req.query;

  notes.filter(searchTerm)
    .then(list => {
      if(list){ 
        res.json(list);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.get('/notes/:id', (req, res, next) => {
  const { id } = req.params;
    
  notes.find(id)
    .then(response => {
      if(response){
        res.json(response);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
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

  console.log(updateObj);
  notes.update(id, updateObj)
    .then(item => {
      //console.log(item);
      if(item) return res.json(item);
      next();
    })
    .catch(err => {
      next(err);
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

  notes.create(newItem)
    .then(item => {
      if(item) return res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      next();
    })
    .catch(error => {
      next(error);
    });

});

router.delete('/notes/:id', (req, res, next) => {
  let {id} = req.params;
  //console.log(notes.data[])

  notes.delete(id)
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(error => {
      next(error);
    });

});

module.exports = router;