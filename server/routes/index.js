var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();

//===================================
//All get routes that send to html view

// router.get('/patientDashboard', function(request, response) {
//   response.sendFile(path.join(__dirname, '../public/views/patient/patientDashboard.html'));
// });
//
// router.get('/doctorDashboard', function(request, response) {
//   response.sendFile(path.join(__dirname, '../public/views/doctor/doctorDashboard.html'));
// });
//
// router.get('/register', function(request, response) {
//   response.sendFile(path.join(__dirname, '../public/views/register.html'));
// });

router.get('/', function(request, response) {
  console.log('sending to index');
  response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

// router.post('/',
//     passport.authenticate('local', {
//         successRedirect: '/views/patientDashboard.html',
//         failureRedirect: '/views/index.html'
//     })
// );


//===================================
//exporting the router

module.exports = router;
