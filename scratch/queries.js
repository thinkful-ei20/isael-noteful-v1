'use strict';

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

//get Notes with search
notes.filter('The', (err, list) => {
    if(err){
        console.error(err);
    }
    console.log(list);
});

//GET Notes by ID
notes.find(1005, (err, item) => {
    if(err){
        console.error(err);
    }

    if(item){
        console.log(item);
    }else{
        console.log('not found');
    }
});

//PUT (update) Notes by ID 
const updateObj = {
    title: 'New Title',
    content: 'Blah blah blah'
};

notes.update(1005, updateObj, (err, item) => {
    if(err){
        console.error(err);
    }
    if(item){
        console.log(item);
    }else{
        console.log('not found');
    }
});
