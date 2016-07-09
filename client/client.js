var app = angular.module('labResults', []);

app.controller('loginController', ['$scope', '$http', '$window', function($scope, $http, $window) {

  var user = {};

  $scope.title = "Login Page";

  $scope.login = function() {

    user = {
      username: $scope.username,
      password: $scope.password
    };

    console.log(user);
  };

  // $http.get('/').then(function(response) {
  //         if(response.data) {
  //             $scope.userName = response.data.username;
  //             console.log('User Data: ', $scope.userName);
  //         } else {
  //             $window.location.href = '/index.html';
  //         }
  //     });

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
        console.log(response.data);
      } else {
        console.log('error');
      }
    })
  };

  // $http.get('/').then(function(response) {
  //         if(response.data) {
  //             $scope.userName = response.data.username;
  //             console.log('User Data: ', $scope.userName);
  //         } else {
  //             $window.location.href = '/index.html';
  //         }
  //     });

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
