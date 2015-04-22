angular.module('wikiwash').controller('DocsController',
  function($scope, $location, $window, pageParser) {
    $scope.pageName = "";

    $scope.getPage = function () {
      var page = pageParser.getPageName($scope.pageName);
      
      $location.path(page);

      $window.location.reload();
    };
  }
);
