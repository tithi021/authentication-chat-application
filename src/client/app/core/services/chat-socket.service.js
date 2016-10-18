
(function() {
  'use strict';
  angular.module('app.core').factory('mySocket', function (socketFactory) {
    return socketFactory();
  });
})();