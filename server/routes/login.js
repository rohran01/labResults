var express = require('express');
var router = express.Router();
// var passport = require('passport');
// var Users = require('../models/user');
// var path = require('path');

// module with bcrypt functions
// var encryptLib = require('../modules/encryption');
// var connection = require('../modules/connection');
// var pg = require('pg');

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var encryptLib = require('../modules/encryption');
var connection = require('../modules/connection');
var pg = require('pg');

router.post('/', function(req, res, next) {

  var loginUser = {
    username: req.body.username,
    password: req.body.password
  }

  pg.connect(connection, function(err, client, done) {

    client.query('SELECT * FROM userprofile WHERE username = $1',
      [loginUser.username],
      function (err, result) {
        client.end();

        if(err) {
          res.status(500).send("Error finding user: ", err);
        } else {
          var storedUser = result.rows[0];
          var passwordToCompare = result.rows[0].password;
          var passwordVerified = encryptLib.comparePassword(loginUser.password, storedUser.password);

          if (passwordVerified) {
            storedUser.password = null;
            res.status(200).json(storedUser);
          } else {
            res.status(500).json({error: true, message: 'Username and password combination is not correct. Please try again.'});
          }
          // res.redirect('/');
        }
    })
  });


})

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
//TODO SQL query
  pg.connect(connection, function (err, client) {

    var user = {};
      var query = client.query("SELECT * FROM users WHERE id = $1", [id]);

      query.on('row', function (row) {
        user = row;
        done(null, user);
      });

      // After all data is returned, close connection and return results
      query.on('end', function () {
          client.end();
      });

      // Handle Errors
      if (err) {
          console.log(err);
      }
  });
});

// Does actual work of logging in
passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'username'
    }, function(req, username, password, done){
	    pg.connect(connection, function (err, client) {
	    	var user = {};
        var query = client.query("SELECT * FROM users WHERE username = $1", [username]);

        query.on('row', function (row) {
        	user = row;

          // Hash and compare
          if(encryptLib.comparePassword(password, user.password)) {
            // all good!
            console.log('matched');
            done(null, user);
          } else {
            console.log('nope');
            done(null, false, {message: 'Incorrect credentials.'});
          }
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
	    });
    }
));

// module.exports = passport;



// router.post('/',
//
//     passport.authenticate('local', {
//         successRedirect: '/views/patientDashboard.html',
//         failureRedirect: '/views/index.html'
//     })
// );

module.exports = router;
