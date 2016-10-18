(function() {
  'use strict';
  angular.module('app.core').factory('AuthStorageService', AuthStorageService);
  AuthStorageService.$inject = ['store'];
  /* @ngInject */
  function AuthStorageService(store) {
    var tokenId = 'token';
    return {
      setStorage: setStorage,
      getStorage: getStorage,
      removeStorage: removeStorage
    };
    // Set Storage
    function setStorage(token) {
        store.set(tokenId, token);
      }
    // Get Storage
    function getStorage() {
        return store.get(tokenId);
      }
    // Remove Storage
    function removeStorage() {
      return store.remove(tokenId);
    }
  }
})();
