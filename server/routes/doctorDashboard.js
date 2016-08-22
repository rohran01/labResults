var express = require('express');
var connection = require('../modules/connection');
var pg = require('pg');

var router = express.Router();

router.get('/myPatientList', function(req, res, next) {

  var id = req.query.id;
  var patientList = [];

  pg.connect(connection, function(err, client, done) {

    var query = client.query('SELECT * FROM userprofile WHERE id IN (SELECT patientid FROM doctorpatient WHERE doctorid = $1)', [id]);

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

    var query = client.query('SELECT id, username, firstname, lastname, email, birthdate, gender, accensionnumber FROM userprofile WHERE activeflag = $1 AND patientflag = $1', ['1']);

    query.on('row', function(row) {
      managePatientsList.push(row);
    });

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
});

router.get('/resourcesList', function(req, res, next) {

  console.log('resources list hit');
  var id = req.query.id;
  var resourcesList = [];

  pg.connect(connection, function(err, client, done) {

    var query = client.query('SELECT * FROM resource WHERE userID = $1', [id]);

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

router.get('/encouragementList', function(req, res, next) {

  console.log('encouragement list hit');
  var id = req.query.id;
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

router.get('/doctorList', function(req, res, next) {

  console.log('doctor list hit');
  var doctorList = [];

  pg.connect(connection, function(err, client, done) {

    var query = client.query('SELECT id, username, firstname, lastname, email, phone FROM userprofile WHERE activeflag = $1 AND doctorflag = $1', ['1']);

    query.on('row', function(row) {
      doctorList.push(row);
    });

    // for (var doctor in doctorList)
    // {
    //   this.password = null;
    // }

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
});

router.get('/doctorGet', function(req, res, next) {

  var id = req.query.id;

  pg.connect(connection, function(err, client, done) {

    var doctor = [];

    var query = client.query('SELECT * FROM userprofile WHERE id = $1 LIMIT 1', [id]);

    query.on('row', function(row) {
      doctor.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(doctor);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });

});

module.exports = router;
