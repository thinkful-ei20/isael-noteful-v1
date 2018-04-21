'use strict';
const chai = require('chai');
const app = require('../server');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.be.json;
      });
  });

});

describe('get the notes from api/notes endpoint', function(){

  it('should return an array with all the notes', function(){
    return chai.request(app)
      .get('/api/notes')
      .then( res => {
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(10);

        const expectKeys = ['id', 'title', 'content'];
        res.body.forEach(function(item){
          expect(item).to.include.keys(expectKeys);
        });
      });
  });

  it('if query is valid it should return the search', function(){
    return chai.request(app)
      .get('/api/notes?searchTerm=5 life lessons learned from cats')
      .then( res => {
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);
        
        const expectKeys = ['id', 'title', 'content'];
        res.body.forEach(item => {
          expect(item.title).to.match(/(?:5 life lessons learned from cats)/);
          expect(item).to.include.keys(expectKeys);
        });
      });
  });

  it('should return empty array if cant find search term', function(){
    return chai.request(app)
      .get('/api/notes?searchTerm=dsakjdjskadajskldjsakldas')
      .then(res => {
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.equal(0);
      });
  });

});
//comment added on comment
describe('get notes with id', function(){

  const ids = [1000, 1005, 9999];
  ids.forEach(function(id){
    it('should return the note object if id exists', function(){
      if(id >= 1000 && id < 1010){
        return chai.request(app)
          .get(`/api/notes/${id}`)
          .then(res => {
            expect(res.body.id).to.equal(id);
            const expectedKeys = ['id', 'title', 'content'];
            expect(res.body).to.include.keys(expectedKeys);
          });
      }else{
        return chai.request(app)
          .get(`/api/notes/${id}`)
          .then(res => {
            expect(res).to.have.status(404);
          });
      }
    });
  });

});

describe('Post new note', function(){
  it('should provide location header if successful', function(){
    return chai.request(app)
      .post('/api/notes')
      .send({'title': 'test','content': 'test'})
      .then(res => {
        expect(res.status).to.equal(201);
        expect(res.header.location).to.exist;
      });
  });

  it('should provide object message with Missing title in request body', function(){
    return chai.request(app)
      .post('/api/notes')
      .send({'title': '', 'content': 'test'})
      .then(res => {
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});

describe('should be able to update note', function(){
  it('should be able to update obj if it exists', function(){
    return chai.request(app)
      .put('/api/notes/1005')
      .send({'title': 'test', 'content': 'test'})
      .then(res => {
        expect(res.body.title).to.equal('test');
        expect(res.body.content).to.equal('test');
      });
  });

  it('should return 404 and error message if it doesnt exist', function(){
    return chai.request(app)
      .put('/api/notes/423891421890')
      .send({'title': 'test', 'content': 'test'})
      .then(res => {
        expect(res.status).to.equal(404);
      });
  });

  it.only('should return an error message if title is missing', function(){
    return chai.request(app)
      .put('/api/notes/1005')
      .send({'title': '', 'content': 'test'})
      .then(res => {
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});