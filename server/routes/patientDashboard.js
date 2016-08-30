var express = require('express');
var path = require('path');
var pg = require('pg');
var connection = require('../modules/connection');

var router = express.Router();

router.get('/myFoodsList/:id', function(req, res, next) {

  console.log('resources list hit');
  var id = req.params.id;
  var myFoodsList = [];

  pg.connect(connection, function(err, client, done) {

    var query = client.query('SELECT * FROM foods WHERE userID = $1', [id]);

    query.on('row', function(row) {
      myFoodsList.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(myFoodsList);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });
});

router.get('/diaryList/:id', function(req, res, next) {

  console.log('resources list hit');
  var id = req.params.id;
  var diaryList = [];

  pg.connect(connection, function(err, client, done) {

    var query = client.query('SELECT * FROM diary WHERE userID = $1', [id]);

    query.on('row', function(row) {
      diaryList.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(diaryList);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });
});

router.get('/libraryList/:id', function(req, res, next) {

  console.log('resources list hit');
  var id = req.params.id;
  var libraryList = [];

  pg.connect(connection, function(err, client, done) {

    var query = client.query('SELECT * FROM resources WHERE userID = $1', [id]);

    query.on('row', function(row) {
      libraryList.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(libraryList);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });
});

router.get('/myDoctor', function(req, res, next) {

  var id = req.query.id;
  var myDoctor = [];

  pg.connect(connection, function(err, client, done) {

    // var doctorID = client.query('SELECT doctorID FROM doctorpatient WHERE activeflag = $1 AND patientID = $2', ['1', id]);

    var query = client.query('SELECT * FROM userprofile WHERE id IN (SELECT doctorID FROM doctorpatient WHERE activeflag = $1 AND patientID = $2)', ['1', id]);

    // myDoctor = query;                   //TODO: This may not be right

    query.on('row', function(row) {
      myDoctor.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(myDoctor);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });
});


module.exports = router;
