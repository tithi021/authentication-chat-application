
 (function() {
  'use strict';
  angular.module('app.home').factory('HomeService', HomeService);
  HomeService.$inject = ['$http', '$q', 'requestService',
    'AuthStorageService', '$stateParams'
  ];
  /* @ngInject */
  function HomeService($http, $q, requestService, AuthStorageService,
    $stateParams) {
    return {
      userVerify: userVerify,
      userList: userList,
      sendChatMessage: sendChatMessage,
      loadChatMessages: loadChatMessages
    };
    function userVerify() {
      // Get storage data
      var storage = AuthStorageService.getStorage('tokenId');
      var request = $http({
        method: 'get',
        url: '/api/userVerify',
        headers: storage
      });
      return (request.then(requestService.handleSuccess, requestService.handleError));
    }
    function userList() {
      // Get storage data
      var storage = AuthStorageService.getStorage('tokenId');
      var request = $http({
        method: 'get',
        url: '/api/userList',
        headers: storage
      });
      return (request.then(requestService.handleSuccess, requestService.handleError));
    }
    function sendChatMessage(data) {
      // Get storage data
      var storage = AuthStorageService.getStorage('tokenId');
      var request = $http({
        method: 'post',
        url: '/api/sendChatMessage',
        headers: storage,
        data: data
      });
      return (request.then(requestService.handleSuccess, requestService.handleError));
    }
    function loadChatMessages(chatUserId) {
      // Get storage data
      var storage = AuthStorageService.getStorage('tokenId');
      var request = $http({
        method: 'get',
        url: '/api/loadChatMessages/' + chatUserId,
        headers: storage
      });
      return (request.then(requestService.handleSuccess, requestService.handleError));
    }
  }
})();
