(function() {
  'use strict';
  angular.module('app.authentication').factory('AuthenticationService',
    AuthenticationService);
  AuthenticationService.$inject = ['$http', '$q', 'apiService', 'requestService'];
  /* @ngInject */
  function AuthenticationService($http, $q, apiService, requestService) {
    return {
      // resetPassword: resetPassword
    };
    // function resetPassword(data) {
    //   var request = $http({
    //     method: 'post',
    //     url: apiService.serverUrl + '/auth/reset',
    //     data: data
    //   });
    //   return (request.then(requestService.handleSuccess, requestService.handleError));
    // }
  }
})();
