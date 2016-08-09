var express = require('express');
var connection = require('../modules/connection');
var pg = require('pg');

var router = express.Router();

router.get('myPatientList/:id', function(req, res, next) {

  console.log('doctor/patient list hit');
  var id = req.params.id;
  var patientIDs = [];
  var patientList = [];

  pg.connect(connection, function(err, client, done) {

    var preQuery = client.query("SELECT patientID FROM doctorpatient WHERE doctorID = $1", [id]);
    preQuery.on('row', function(row) {
      patientIDs.push(row);
    });

    var query = client.query('SELECT * FROM userprofile WHERE userID IN $1', [patientIDs]);

    query.on('row', function(row) {
      patientList.push(row);
    });

    for (var patient in patientList)
    {
      this.password = null;
    }

    query.on('end', function() {
      client.end();
      return res.json(patientList);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });

});

router.get('/managePatientsList', function(req, res, next) {

  console.log('manage patients list hit');
  var managePatientsList = [];

  pg.connect(connection, function(err, client, done) {

    var query = client.query('SELECT * FROM userprofile WHERE activeflag = $1 AND patientflag = $1', ['1']);

    query.on('row', function(row) {
      managePatientsList.push(row);
    });

    for (var patient in managePatientsList)
    {
      this.password = null;
    }

    // After all data is returned, close connection and return results
    query.on('end', function() {

      client.end();
      return res.json(managePatientsList);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });
  // res.send(200);
});

router.get('resourcesList/:id', function(req, res, next) {

  console.log('resources list hit');
  var id = req.params.id;
  var resourcesList = [];

  pg.connect(connection, function(err, client, done) {

    var query = client.query('SELECT * FROM resources WHERE userID = $1', [id]);

    query.on('row', function(row) {
      resourcesList.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(resourcesList);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });

});

router.get('encouragementList/:id', function(req, res, next) {

  console.log('encouragement list hit');
  var id = req.params.id;
  var encouragementList = [];

  pg.connect(connection, function(err, client, done) {

    var query = client.query('SELECT * FROM encouragement WHERE userID = $1', [id]);

    query.on('row', function(row) {
      encouragementList.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(encouragementList);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });

  });
});

router.get('/doctorList', function(req, res, next) {

  console.log('doctor list hit');
  var doctorList = [];

  pg.connect(connection, function(err, client, done) {

    var query = client.query('SELECT * FROM userprofile WHERE activeflag = $1 AND doctorflag = $1', ['1']);

    query.on('row', function(row) {
      doctorList.push(row);
    });

    for (var doctor in doctorList)
    {
      this.password = null;
    }

    // After all data is returned, close connection and return results
    query.on('end', function() {

      client.end();
      return res.json(doctorList);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });
  // res.send(200);
});



module.exports = router;
