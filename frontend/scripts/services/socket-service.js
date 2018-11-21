/* global angular */

angular.module('wikiwash').factory('socketService',
  ['socketFactory', function(socketFactory) {
    return {
      socket: socketFactory(),
      cycling: false
    };
  }
]);
