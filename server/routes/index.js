var express = require('express');
var path = require('path');
var router = express.Router();

//===================================
//All get routes that send to html view

router.get('/patientDashboard', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/patient/patientDashboard.html'));
});

router.get('/doctorDashboard', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/doctor/doctorDashboard.html'));
});

router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/login.html'));
});



// router.get('/events', function(request, response){
//   Schedule.find({}, function(error, events) {
//     if (error) {
//       console.log(error);
//     } else {
//       response.send(events);
//     }
//   });
// });


//===================================
//exporting the router

module.exports = router;
