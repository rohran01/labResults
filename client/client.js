var app = angular.module('labResults', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
        //   console.log('/ partial hit');
            templateUrl: 'views/login.html',
            controller: 'loginController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'registerController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginController'
        })
        .when('/patientDashboard', {
            templateUrl: 'views/patientDashboard.html',
            controller: 'patientDashboardController'
        })
        .when('/doctorDashboard', {
            templateUrl: 'views/doctorDashboard.html',
            controller: 'doctorDashboardController'
        });

    $locationProvider.html5Mode(true);
}]);

app.controller('loginController', ['$scope', '$http', '$location', 'AuthService', function($scope, $http, $location, AuthService) {

  var user = {};

  $scope.title = "Login Page";

  $scope.login = function() {

    user = $scope.user;
    AuthService.login(user).then(function() {
      var serviceUser = AuthService.getUserStatus();
      console.log('logged in?', AuthService.isLoggedIn());
      console.log('patient flag?', serviceUser.patientflag);
      if (serviceUser.patientflag && AuthService.isLoggedIn) {
        $location.path('patientDashboard');
      } else if (serviceUser.doctorflag && AuthService.isLoggedIn) {
        $location.path('doctorDashboard');
      }
    }).then(function() {
      console.log('user info', AuthService.getUserStatus());
    });
  };


  $scope.registrationRedirect = function(){
    console.log('clicked!');
    $location.path('register');
  };

}]);

app.controller('registerController', ['$scope', '$http', '$location', function($scope, $http, $location) {

  var user = {};

  $scope.title = "Registration Page";

  $scope.register = function() {

    user = $scope.user;

    console.log(user);

    $http.post('/register', this.user).then(function(response) {
      if(response.data) {
        if (response.data.name === 'error') {
            alert('This username already exists. Please pick a new one.');             //TODO: Improve user alerts
          } else {
            alert('Your account has been created. Please log in on the next screen.');    //TODO: Improve user alerts

            $location.path('');

          }
      } else {
        console.log('error');
      }
    });
  };

  $scope.loginRedirect = function(){

    $location.path('');
  };

}]);

app.controller('patientDashboardController', ['$scope', '$http', '$location', 'anchorSmoothScroll', 'AuthService', function($scope, $http, $location, anchorSmoothScroll, AuthService) {

  $scope.currentUser = AuthService.getUserStatus();
  console.log('dashboard user', $scope.currentUser);
  // console.log($scope.currentUser);

  $scope.logout = function() {
    AuthService.logout();
    $location.path('');
  };

  $scope.goTo = function(locationId) {

    // $location.hash(locationId);
    anchorSmoothScroll.scrollTo(locationId);
  };
}]);

app.controller('doctorDashboardController', ['$scope', '$http', '$location', 'anchorSmoothScroll', 'AuthService', function($scope, $http, $location, anchorSmoothScroll, AuthService) {

  var doctorID = AuthService.getUserStatus.userID;
  $scope.createDoctor = false;
  $scope.patientList = [];
  $scope.doctorList = [];
  console.log($scope.createDoctor);


  function patientList()
  {
    $http.get('/doctorDashboard/patientList/:doctorID').then(function(response) {
      console.log('patient list:', response);
      $scope.patientList = response.data;
    });
  }

  function doctorList()
  {
    $http.get('/doctorDashboard/doctorList').then(function(response) {
      console.log('doctor list:', response);
      $scope.doctorList = response.data;
    });
  }

  $scope.currentUser = AuthService.getUserStatus();

  if ($scope.currentUser.adminflag)
  {
    $scope.admin = true;
  }

  $scope.createDoctor = function() {
    var doctorToAdd = $scope.doctor;
    console.log(doctorToAdd);

  };

  $scope.logout = function() {
    //TODO: create proper logout service
    AuthService.logout();
    $location.path('');
  };

  $scope.goTo = function(locationId) {
    // $location.hash(locationId);
    anchorSmoothScroll.scrollTo(locationId);
  };

  doctorList();

}]);

app.factory('AuthService', ['$location', '$q', '$timeout', '$http', function ($location, $q, $timeout, $http) {

    // create user variable
    var userIsLoggedIn = null;
    var User;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
      userInfo: userInfo,
      User: User
    });

    function userInfo() {
      console.log('userInfo hit');
      return User;
    }


    function isLoggedIn() {
      if(userIsLoggedIn !== null) {
        return true;
      } else {
        return false;
      }
    }

    function getUserStatus() {
      console.log(User);
      return User;
    }

    function login(user) {
      console.log('login service hit');
    // create a new instance of deferred
      var deferred = $q.defer();
      // send a post request to the server
      $http.post('/login', user)
        // handle success
        .success(function (data, status) {
          if(status === 200){
            console.log('success');
            userIsLoggedIn = true;
            console.log('data', data.id);
            User = data;
            console.log('user in service', user);
            deferred.resolve();

          } else {
            console.log(data);
            console.log('error in success');
            userIsLoggedIn = false;
            user = null;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          console.log('error in error');
          userIsLoggedIn = false;
          user = null;
          deferred.reject();
        });
      // return promise object
      return deferred.promise;
    }




    function logout() {
      User = {};
      userIsLoggedIn = false;
      console.log(User);

    // create a new instance of deferred
      var deferred = $q.defer();
      // send a get request to the server
      // $http.get('/logout')
      //   // handle success
      //   .success(function (data) {
      //     user = false;
      //     $location.path();
      //     deferred.resolve();
      //   })
      //   // handle error
      //   .error(function (data) {
      //     user = false;
      //     deferred.reject();
      //   });

    // return promise object
      return deferred.promise;

    }

    function register(user) {
    // create a new instance of deferred
      var deferred = $q.defer();
    // send a post request to the server
      $http.post('/register', user)
        // handle success
        .success(function (data, status) {
          if(status === 200){
            alert('Your account has been created. Please log in on the next screen.');    //TODO: Improve user alerts
            $location.path('');
            deferred.resolve();
          } else {
            alert('This username already exists. Please pick a new one.');             //TODO: Improve user alerts
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });
      // return promise object
      return deferred.promise;
    }
}]);

app.service('anchorSmoothScroll', function(){

    this.scrollTo = function(locationId) {

        // This scrolling function
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(locationId);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 20);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i = startY; i < stopY; i += step) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i = startY; i > stopY; i -= step) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(locationId) {
            var elm = document.getElementById(locationId);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }
    };
});
