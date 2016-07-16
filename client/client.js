var app = angular.module('labResults', []);

app.controller('loginController', ['$scope', '$http', '$window', 'AuthService', function($scope, $http, $window, AuthService) {

  var user = {};

  $scope.title = "Login Page";

  $scope.login = function() {

    user = $scope.user;
    AuthService.login(user).then(function() {
      var serviceUser = AuthService.isLoggedIn;
      console.log(serviceUser);
      // if (AuthService.user.patientflag && AuthService.userIsLoggedIn) {
      //   window.location = '/patientDashboard';
      // } else if (AuthService.user.doctorflag && AuthService.userIsLoggedIn) {
      //   window.location = '/doctorDashboard';
      // }
    })


  }

  //   $http.post('/login', this.user).then(function(response) {
  //     if(response.data) {
  //       console.log(response.data);
  //       if(response.data.error) {
  //         alert(response.data.message);                                     //TODO: Improve user alerts
  //       } else if(response.data.user.patientflag) {
  //         window.location = '/patientDashboard'
  //       } else if(response.data.user.doctorflag) {
  //         window.location = '/doctorDashboard'
  //       }
  //     } else {
  //       alert('There was an error in the login process. Please try again.')    //TODO: Improve user alerts
  //       console.log('error');
  //     }
  //   })
  // }


  $scope.registrationRedirect = function(){
    window.location = "/register";
  }

}]);

app.controller('registerController', ['$scope', '$http', '$window', function($scope, $http, $window) {

  var user = {};

  $scope.title = "Registration Page";

  $scope.register = function() {

    user = $scope.user;

    console.log(user);

    $http.post('/register', this.user).then(function(response) {
      if(response.data) {
        if (response.data.name == 'error') {
            alert('This username already exists. Please pick a new one.');             //TODO: Improve user alerts
          } else {
            alert('Your account has been created. Please log in on the next screen.');    //TODO: Improve user alerts
            $window.location = "/";
          }
      } else {
        console.log('error');
      }
    })
  };

  $scope.loginRedirect = function(){
    window.location = "/";
  }

}]);

app.controller('patientDashboardController', ['$scope', 'anchorSmoothScroll', function($scope, anchorSmoothScroll) {
  $scope.goTo = function(locationId) {
    // $location.hash(locationId);
    anchorSmoothScroll.scrollTo(locationId);
  };
}]);

app.controller('doctorDashboardController', ['$scope', 'anchorSmoothScroll', function($scope, anchorSmoothScroll) {
  $scope.goTo = function(locationId) {
    // $location.hash(locationId);
    anchorSmoothScroll.scrollTo(locationId);
  };
}]);

app.factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

    // create user variable
    var userIsLoggedIn = null;
    var user = {};

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
      userInfo: userInfo
    });

    function userInfo() {
      console.log('userInfo hit');
      return user;
    }


    function isLoggedIn() {
      if(userIsLoggedIn) {
        return true;
      } else {
        return false;
      }
    }

    function getUserStatus() {
      return user;
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
            user = data;
            console.log('user in service', user)
            deferred.resolve();

          } else {
            console.log(data);
            console.log('error in success')
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
    };

    function logout() {
    // create a new instance of deferred
      var deferred = $q.defer();
      // send a get request to the server
      $http.get('/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

    // return promise object
      return deferred.promise;

    };

    function register(user) {
    // create a new instance of deferred
      var deferred = $q.defer();
    // send a post request to the server
      $http.post('/register', user)
        // handle success
        .success(function (data, status) {
          if(status === 200){
            alert('Your account has been created. Please log in on the next screen.');    //TODO: Improve user alerts
            $window.location = "/";
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
    };
}]);

app.service('anchorSmoothScroll', function(){

    this.scrollTo = function(locationId) {

        // This scrolling function
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(locationId) - 21;
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
