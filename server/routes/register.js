var express = require('express');
var router = express.Router();
var passport = require('passport');
// var Users = require('../models/user');
var path = require('path');

// module with bcrypt functions
var encryptLib = require('../modules/encryption');
var connection = require('../modules/connection');
var pg = require('pg');

// Handles request for HTML file
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../public/views/register.html'));
});

//TODO: upgrade to guid generation in db

// Handles POST request with new user data
router.post('/', function(req, res, next) {

  var saveUser = {
    username: req.body.username,
    password: encryptLib.encryptPassword(req.body.password),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
    patientflag: req.body.patientflag,
    doctorflag: req.body.doctorflag,
    adminflag: req.body.adminflag,
    activeflag: 1
  };

  pg.connect(connection, function(err, client, done) {

    client.query('INSERT INTO userprofile (username, password, firstName, lastName, phone, email, gender, birthdate, patientflag, doctorflag, adminflag, activeflag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
      [saveUser.username, saveUser.password, saveUser.firstName, saveUser.lastName, saveUser.phone, saveUser.email, saveUser.gender, saveUser.birthdate, saveUser.patientflag, saveUser.doctorflag, saveUser.adminflag, saveUser.activeflag],
      function (err, result) {
        client.end();

        if(err) {
          res.status(500).send("Error inserting data: ", err);
        } else {
          console.log('else hit');
          res.redirect('/');
        }
    })
  });
});


module.exports = router;
