(function() {
  'use strict';
  angular.module('app.authentication').factory('AuthenticationService',
    AuthenticationService);
  AuthenticationService.$inject = ['$http', '$q', 'requestService'];
  /* @ngInject */
  function AuthenticationService($http, $q, requestService) {
    return {
      userLogin: userLogin,
      userRegistration: userRegistration
    };
    // Send API request for User Login
    function userLogin(data) {
      var request = $http({
        method: 'post',
        url: '/api/login',
        data: data
      });
      return (request.then(requestService.handleSuccess, requestService.handleError));
    }
    function userRegistration(data) {
      var request = $http({
        method: 'post',
        url: '/api/registration',
        data: data
      });
      return (request.then(requestService.handleSuccess, requestService.handleError));
    }
  }
})();
