//This is the start of the server
//================================================
//List of all the required modules and routes
// require('dotenv').config();                 //brings in local environment variables that are not pushed to github (dotenv.env is included in .gitignore)
var express = require('express');
var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');

//=================================================
// Routes

// var authenticate = require('./routes/authentication');
var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
// var patientDashboard = require('./routes/patientDashboard');
<<<<<<< HEAD
// var doctorDashboard = require('./routes/doctorDashboard');
=======
var doctorDashboard = require('./routes/doctorDashboard');
>>>>>>> 68d7a3f6e5d24a9a8ca8094c1b809ee476317896
// var salad = require('./routes/saladDocument');
// var createRequest = require('./routes/requestDocument');
// var recipients = require('./routes/recipients');
// var respond = require('./routes/respond.js');
var app = express();

//=================================================
// body parser middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//=================================================
// use and configure server sessions

app.use(session({
  secret: 'secret',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 600000,
    secure: false
  }
}));

//=================================================
// initialize passport

// passport.init(app);
app.use(passport.initialize());
app.use(passport.session());

//=================================================
// Middleware and routes
app.use(express.static('server/public'));
// app.use('/authenticate', authenticate);
// app.use('/createRequest', createRequest);
// app.use('/requestRecipients', recipients);
// app.use('/respond', respond);
// app.use('/patientDashboard', patientDashboard);
<<<<<<< HEAD
// app.use('/doctorDashboard', doctorDashboard);
=======
app.use('/doctorDashboard', doctorDashboard);
>>>>>>> 68d7a3f6e5d24a9a8ca8094c1b809ee476317896
app.use('/login', login);
app.use('/register', register);
app.use('/', index);

//=================================================
// Initiate server
var server = app.listen(process.env.PORT || 3000, function(){
  var port = server.address().port;
  console.log('listening on port', port);
});
