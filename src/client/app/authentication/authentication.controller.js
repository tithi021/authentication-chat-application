(function() {
  'use strict';
  angular.module('app.authentication').controller('AuthController',
    AuthController);
  AuthController.$inject = ['$state', 'logger', 'AuthStorageService', 'AuthenticationService'];
  /* @ngInject */
  function AuthController($state, logger, AuthStorageService, AuthenticationService) {
    var vm = this;
    vm.login = function() {
      // Get user data for login
      var data = {
        username: vm.login.username,
        password: vm.login.password
      };
      AuthenticationService.userLogin(data).then(function(successMessage) {
        // Store Token
        var token = {
          token: successMessage.token
        };
        AuthStorageService.setStorage(token);
        $state.go('home');
      }, function(errorMessage) {
        logger.error('errorMessage');
      });
    };
    vm.registration = function() {
      var data = {
        fullname: vm.registration.fullname,
        username: vm.registration.username,
        email: vm.registration.email,
        password: vm.registration.password
      };
      AuthenticationService.userRegistration(data).then(function(successMessage) {
        // Store Token
        var token = {
          token: successMessage.token
        };
        AuthStorageService.setStorage(token);
        $state.go('home');
      }, function(errorMessage) {
        logger.error('errorMessage');
      });
    };
  }
})();
