(function() {
  'use strict';
  angular.module('app.core').factory('requestService', requestService);
  requestService.$inject = ['$q'];

  function requestService($q) {
    return ({
      handleSuccess: handleSuccess,
      handleError: handleError
    });
    // HTTP Request handle success message
    function handleSuccess(response) {
      return (response.data);
    }
    // HTTP Request handle error message

    function handleError(response) {
      // The API response from the server should be returned in a
      // nomralized format. However, if the request was not handled by the
      // server (or what not handles properly - ex. server error), then we
      // may have to normalize it on our end, as best we can.
      if (!angular.isObject(response.data) || !response.data.message) {
        return ($q.reject('An unknown error occurred.'));
      }
      // Otherwise, use expected error message.
      return ($q.reject(response.data.message));
    }
  }
})();
