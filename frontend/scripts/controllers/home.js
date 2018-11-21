/* global angular */

angular.module('wikiwash').controller('HomeController',
  [
  '$scope', '$location', 'socketService', 'pageParser', 'suggestions',
  function($scope, $location, socketService, pageParser, suggestions) {
    $scope.pageName = '';
    $scope.revisions = [ ];

    var urlEscapeCodeRegex = /[^0-9a-zA-Z]/g;

    $scope.suggestions = _.map(suggestions.data, function(suggestion) {
      return {
        url: suggestion[0],
        title: suggestion[0].replace(/_/g, ' ')
      };
    });

    $scope.submit = function() {
      $location.path(pageParser.getPageName($scope.pageName));
    };
    
    if (socketService.cycling) {
      socketService.socket.emit('stop cycle');
      socketService.cycling = false;
    }
  }
]);
