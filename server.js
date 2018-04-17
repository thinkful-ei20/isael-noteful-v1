'use strict';
const express = require('express');
const data = require('./db/notes');
const { PORT } = require('./config');
const { logger } = require('./middleware/logger');
const app = express();
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
app.use(express.static('public'));
app.use(logger);

app.get('/api/notes', (req,res) => { 
    const query = req.query.searchTerm;
    if(query === undefined) return res.json(data);
    res.json(data.filter(item => item.title.includes(query))); 
});

app.get('/api/notes/:id', (req, res) => {
    res.json(data.find(item => item.id === Number(req.params.id)));
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