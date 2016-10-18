(function() {
  'use strict';
  angular.module('app.home')
    .controller('HomeController', HomeController);
  HomeController.$inject = ['logger', '$state', 'HomeService',
    'AuthStorageService', '$scope', '$rootScope', 'mySocket'
  ];
  /* @ngInject */
  function HomeController(logger, $state, HomeService, AuthStorageService, $scope, $rootScope, mySocket) {
    var vm = this;
    vm.title = 'Home';
    $scope.chatMessages = [];
    userVerify();
    // var origin = window.location.origin;
    // var socket = io.connect(origin);
    
    // User verify
    function userVerify() {
        // Call a HTTP request
        HomeService.userVerify()
          .then(function(successMessage) {
            $rootScope.username = successMessage.username;
            $rootScope.fullname = successMessage.fullname;
            $rootScope.userid = successMessage._id;
            activate();
          }, function(errorMessage) {
            $state.go('404');
          });
      }
      // logout function
    vm.logout = function() {
      AuthStorageService.removeStorage();
      $state.go('authentication');
    };
    // Load user list
    vm.userList = function() {
      HomeService.userList()
        .then(function(successMessage) {
          vm.users = successMessage;
        }, function(errorMessage) {
          logger.error(errorMessage);
        });
    };
    // chat fetch
    vm.goChatWindow = function(selectedUser) {
      $rootScope.selectedUser = selectedUser;
      HomeService.loadChatMessages($rootScope.selectedUser).then(function(successMessage) {
        $scope.chatMessages = successMessage;
      }, function(errorMessage){
        console.log(errorMessage);
      });
    };

    vm.chat = function(selectedUserId, selectedUser) {
        var chatInfos = {
          messages: vm.messages,
          createdDate: new Date(),
          to: {
            '_id': selectedUserId,
            'fullname': selectedUser.fullname
          },
          from: {
            '_id': $rootScope.userid,
             'fullname': $rootScope.fullname
          }
        };
        var data = {
          chatUser: selectedUserId,
          messages: vm.messages
        };
        HomeService.sendChatMessage(data).then(function(successMessage) {
          vm.messages = '';
         
          $scope.chatMessages = chatInfos;

        }, function(errorMessage) {
          logger.error(errorMessage);
        });
      
    };
    function activate() {
      logger.info('Activated Home View');
    }
  }
})();
