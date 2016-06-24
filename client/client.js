var app = angular.module('labResults', []);

// app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
//   $routeProvider
//     .when('/', {
//       templateUrl: 'views/login.html',
//       controller: 'loginController',
//       controllerAs: 'login'
//     })
//     .when('/patientDashboard', {
//       templateUrl: 'views/patientDashboard.html',
//       controller: 'patientDashboardController',
//       controllerAs: 'patient'
//     })
//     .when('/doctorDashboard', {
//       templateUrl: 'views/doctorDashboard.html',
//       controller: 'doctordashboardController',
//       controllerAs: 'doctor'
//     });
//
//   $locationProvider.html5Mode(true);
// }]);

app.controller('loginController', ['$scope', function($scope) {

  var user = {};

  $scope.title = "Login Page";

  $scope.login = function() {

    user = {
      username: $scope.username,
      password: $scope.password
    };

    console.log(user);
  };






}])
