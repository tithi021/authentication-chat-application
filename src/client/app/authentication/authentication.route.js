(function() {
  'use strict';
  angular.module('app.authentication').run(appRun);
  appRun.$inject = ['routerHelper', '$window'];
  /* @ngInject */
  function appRun(routerHelper, $window) {
    routerHelper.configureStates(getStates());
  }
  function getStates() {
    return [{
      state: 'Authentication',
      config: {
        url: '/',
        templateUrl: 'app/authentication/authentication.html',
        controller: 'AuthController as vm',
        title: 'Authentication'
      }
    }];
  }
})();
