(function() {
  'use strict';
  angular.module('app.authentication').controller('AuthController',
    AuthController);
  AuthController.$inject = ['$state'];
  /* @ngInject */
  function AuthController($state) {
    var vm = this;
    // User Registration
    // auth.route('/registration').post(controller.registration);

    // User Login
    // auth.route('/login').post(controller.login);
  }
})();
