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
  console.log('register post hit');
  console.log('req.body', req.body);
  var saveUser = {
    username: req.body.username,
    password: encryptLib.encryptPassword(req.body.password),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
    patientflag: 1
  };
  console.log('new user:', saveUser);

  pg.connect(connection, function(err, client, done) {
    client.query("INSERT INTO userprofile (username, password, firstName, lastName, phone, email, gender, birthdate, patientflag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      [saveUser.username, saveUser.password, saveUser.firstName, saveUser.lastName, saveUser.phone, saveUser.email, saveUser.gender, saveUser.birthdate, saveUser.patientflag],
        function (err, result) {
          client.end();

          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            res.redirect('/');
          }
        });
  });

});


module.exports = router;
