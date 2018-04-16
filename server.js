'use strict';
const express = require('express');
const data = require('./db/notes');
const app = express();
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
app.use(express.static('public'));

app.get('/api/notes', (req,res) => { 
    const query = req.query.searchTerm;
    let result = data.filter(item => item.title.includes(query));
    query === undefined ? res.json(data) : res.json(result);
});

app.get('/api/notes/:id', (req, res) => {
    res.json(data.find(item => item.id === Number(req.params.id)));
});

app.listen(8080, function() {
    console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
    console.error(err);
});