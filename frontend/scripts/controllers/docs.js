angular.module('wikiwash').controller('DocsController',
  function($scope, $location, $window, pageParser) {
    $scope.pageName = "";
    $scope.locale = window.locale;
  }
);
