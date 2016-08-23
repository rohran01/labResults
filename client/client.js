var app = angular.module('labResults', ['ngRoute', 'ajoslin.promise-tracker']);

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

app.controller('loginController', ['$scope', '$http', '$location', 'AuthService', 'promiseTracker', function($scope, $http, $location, AuthService, promiseTracker) {

  var user = {};

  $scope.title = "Login Page";

  $scope.login = function(form) {

    $scope.submitted = true;

    if (form.$invalid) {
      return;
    }

    user = $scope.user;

    AuthService.login(user).then(function() {
      var serviceUser = AuthService.getUserStatus();
      if (serviceUser.patientflag && AuthService.isLoggedIn) {
        $location.path('patientDashboard');
      } else if (serviceUser.doctorflag && AuthService.isLoggedIn) {
        $location.path('doctorDashboard');
      }
    });
  };


  $scope.registrationRedirect = function(){
    $location.path('register');
  };

}]);

app.controller('patientDashboardController', ['$scope', '$http', '$location', 'anchorSmoothScroll', 'AuthService', function($scope, $http, $location, anchorSmoothScroll, AuthService) {

  $scope.myFoodsList = [];
  $scope.diaryList = [];
  $scope.libraryList = [];
  $scope.myDoctor = {};
  $scope.currentUser = AuthService.getUserStatus();
  // console.log($scope.currentUser);

  function myFoodsList()
  {
    $http.get('/patientDashboard/myFoodsList/', {params: {id: $scope.currentUser}}).then(function(response) {
      $scope.myFoodsList = response.data;
    });
  }

  function diaryList()
  {
    $http.get('/patientDashboard/diaryList/', {params: {id: $scope.currentUser.ID}}).then(function(response) {
      $scope.diaryList = response.data;
    });
  }

  function libraryList()
  {
    $http.get('/patientDashboard/libraryList/', {params: {id: $scope.currentUser.ID}}).then(function(response) {
      $scope.libraryList = response.data;
    });
  }

  function myDoctor()
  {
    $http.get('/patientDashboard/myDoctor/', {params: {id: $scope.currentUser.ID}}).then(function(response) {
      $scope.myDoctor = response.data;
    });
  }

  $scope.logout = function() {
    AuthService.logout();
    $location.path('');
  };

  $scope.goTo = function(locationId) {
    anchorSmoothScroll.scrollTo(locationId);
  };

  function initializePage() {
    myFoodsList();
    diaryList();
    libraryList();
    myDoctor();
  }

  initializePage();

}]);

app.controller('doctorDashboardController', ['$scope', '$http', '$location', '$log', '$timeout', 'anchorSmoothScroll', 'AuthService', 'promiseTracker', function($scope, $http, $location, $log, $timeout, anchorSmoothScroll, AuthService, promiseTracker) {

  $scope.currentUser = AuthService.getUserStatus();  //TODO: uncomment -- commented out for remote testing
  $scope.newDoctor = {};
  $scope.preDoctor = {};
  $scope.editDoctor = {};
  var idHolder;
  $scope.myPatientList = [];
  $scope.managePatientsList = [];
  $scope.resourcesList = [];
  $scope.encouragementList = [];
  $scope.doctorList = [];
  $scope.progress = promiseTracker();

  if ($scope.currentUser.adminflag) {
    $scope.admin = true;
  }

  function myPatientList() {
    console.log('my patient list id:', $scope.currentUser);
    $http.get('/doctorDashboard/myPatientList/', {params: {id: $scope.currentUser.id}}).then(function(response) {
      $scope.myPatientList = response.data;
    });
  }

  function managePatientsList() {
    $http.get('/doctorDashboard/managePatientsList').then(function(response) {
      $scope.managePatientsList = response.data;
    });
  }

  function resourcesList() {
    $http.get('/doctorDashboard/resourcesList/', {params: {id: $scope.currentUser.id}}).then(function(response) {
      $scope.resourcesList = response.data;
    });
  }

  function encouragementList() {
    $http.get('/doctorDashboard/encouragementList/', {params: {id: $scope.currentUser.id}}).then(function(response) {
      $scope.encouragementList = response.data;
    });
  }

  function doctorList() {
    $http.get('/doctorDashboard/doctorList').then(function(response) {
      $scope.doctorList = response.data;
      console.log('doctor list:', $scope.doctorList);
    });
  }

  $scope.createDoctor = function(form) {

    $scope.submitted = true;

    if (form.$invalid) {
      console.log('invalid form');
      return;
    }

    var doctorToAdd = $scope.newDoctor;
    doctorToAdd.doctorflag = 1;

    if (doctorToAdd.adminflag === 'true')
    {
      doctorToAdd.adminflag = 1;
    } else {
      doctorToAdd.adminflag = 0;
    }

    var $promise = $http.post('/register/addDoctor', doctorToAdd)
    .success(function(data, status, headers, config) {
      if (status === 200) {
        $scope.newDoctor = null;
        $scope.messages = config.data.firstName + ' ' + config.data.lastName + ' has been added!';
        $scope.submitted = false;
        doctorList();
      } else {
        $scope.messages = 'Oops, we received your request, but there was an error processing it.';
        $log.error(data);
      }
    })
    .error(function(data, status, headers, config) {
      $scope.progress = data;
      $scope.messages = 'There was a network error. Try again later.';
      $log.error(data);
    })
    .finally(function() {
      // Hide status messages after three seconds.
      $timeout(function() {
        $scope.messages = null;
      }, 3000);
    });

    // Track the request and show its progress to the user.
    $scope.progress.addPromise($promise);

  };

  $scope.beginEdit = function(type, id) {

    $scope.preDoctor = {};
    idHolder = id;
    console.log(idHolder);

    if (type === 'manageDoctors')
    {
      $http.get('/doctorDashboard/doctorGet/', {params: {id: id}}).then(function(response) {
        $scope.preDoctor = response.data[0];
      });
    }
  }

  $scope.edit = function(type, form, id) {

    $scope.submitted = true;

    console.log('editDoctor', $scope.editDoctor);
    var doctorToEdit = $scope.preDoctor;

    doctorToEdit.id = id;

    doctorToEdit.firstname = $scope.editDoctor.firstname != null ? $scope.editDoctor.firstname : $scope.preDoctor.firstname;
    doctorToEdit.lastname = $scope.editDoctor.lastname != null ? $scope.editDoctor.lastname : $scope.preDoctor.lastname;
    doctorToEdit.phone = $scope.editDoctor.phone != null ? $scope.editDoctor.phone : $scope.preDoctor.phone;
    doctorToEdit.email = $scope.editDoctor.email != null ? $scope.editDoctor.email : $scope.preDoctor.email;
    doctorToEdit.username = $scope.editDoctor.username != null ? $scope.editDoctor.username : $scope.preDoctor.username;

    doctorToEdit.doctorflag = 1;

    if ($scope.editDoctor.adminflag === 'true')
    {
      doctorToEdit.adminflag = 1;
    } else {
      doctorToEdit.adminflag = 0;
    }


    console.log('edit', doctorToEdit);

    var $promise = $http.post('/doctorDashboard/doctorEdit/', doctorToEdit)
    .success(function(data, status, headers, config) {
      if (status === 200) {
        console.log('config', config);
        $scope.preDoctor = doctorToEdit;
        $scope.editDoctor = {};
        $scope.messages = 'Changes to ' + config.data.firstname + ' ' + config.data.lastname + ' have been saved!';
        $scope.submitted = false;
      } else {
        $scope.messages = 'Oops, we received your request, but there was an error processing it.';
        $log.error(data);
      }
    })
    .error(function(data, status, headers, config) {
      $scope.progress = data;
      $scope.messages = 'There was a network error. Try again later.';
      $log.error(data);
    })
    .finally(function() {
      doctorList();
      // Hide status messages after three seconds.
      $timeout(function() {
        $scope.messages = null;
      }, 3000);
    });

    $scope.progress.addPromise($promise);

  }

  $scope.beginDelete = function(type, id) {

    $scope.preDoctor = {};
    $scope.prePatient = {};
    idHolder = id;
    console.log(idHolder);

    if (type === 'manageDoctors') {
      $http.get('/doctorDashboard/doctorGet/', {params: {id: id}}).then(function(response) {
        $scope.preDoctor = response.data[0];
      });
    }

    if (type === 'managePatients') {
      $http.get('/doctorDashboard/patientGet/', {params: {id: id}}).then(function(response) {
        $scope.prePatient = response.data[0];
      });
    }
  }

  $scope.delete = function(type, id) {

    idHolder = {id: id};

    console.log('delete id:', idHolder)

    if (type === 'manageDoctors' || type === 'managePatients') {
      console.log('manageDoctorsDelete hit');
      $http.post('/doctorDashboard/userDelete/', idHolder)
        .success(function(data, status, headers, config) {
          if (status === 200) {
            $scope.preDoctor = null;
            $scope.prePatient = null;
          } else {
            alert('Oops, we received your request, but there was an error processing it.');
            $log.error(data);
          }
        })
        .error(function(data, status, headers, config) {
          // $scope.progress = data;
          alert('There was a network error. Try again later.');
          $log.error(data);
        })
        .finally(function() {
          if (type === 'manageDoctors') {
            doctorList();
          }
          if (type === 'managePatients') {
            console.log('reloading patients');
            managePatientsList();
          }
        })
      }
    }




  $scope.logout = function() {
    //TODO: create proper logout service
    AuthService.logout();
    $location.path('');
  };

  $scope.goTo = function(locationId) {
    anchorSmoothScroll.scrollTo(locationId);
  };

  // $scope.edit = function(type, id)
  // {
  //   console.log('edit:', type, id);
  // }

  function initializePage() {
    myPatientList();
    managePatientsList();
    resourcesList();
    encouragementList();
    doctorList();
  }

  initializePage();     //TODO: uncomment -- commented out for remote testing

}]);

app.directive('datepicker', function() {
  return {
    restrict: 'A',
    scope: {
      'model': '='
    },
    link: function(scope, elem, attrs) {
      $(elem).pickadate({
        selectMonths: true,
        selectYears: 100
      });
    }
  };
});

app.directive('modalTrigger', function() {
  console.log('modal hit');
  return {
    restrict: 'A',
    scope: {
      'model': '='
    },
    link: function(scope, elem, attrs) {
      $(elem).leanModal();

    }
  };
});

app.directive('collapse', function() {
  console.log('collapse hit');
  return {
    restrict: 'A',
    scope: {
      'model': '='
    },
    link: function(scope, elem, attrs) {
      $(elem).collapsible({
        accordion : true
      });
    }
  };
});

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
      return User;
    }

    function login(user) {

      isLoggedIn = false;
      User = {};
      console.log(user);
    // create a new instance of deferred
      var deferred = $q.defer();
      // send a post request to the server
      $http.post('/login', user)
        // handle success
        .success(function (data, status) {
          if(status === 200){
            console.log('success');
            userIsLoggedIn = true;
            User = data;
            deferred.resolve();

          } else {
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
        for (var i = startY; i > stopY; i -= step) {
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
            while (node.offsetParent && node.offsetParent !== document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }
    };
});
