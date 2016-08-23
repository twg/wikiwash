/* global angular */

angular.module('wikiwash')
.directive('socialButtons', ['$window', '$location', function($window, $location) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/views/directives/social-buttons.html',
    controller: function($scope, $location) {
      $scope.urls = {
        "email": "mailto:wikiwash@twg.ca",
        "facebook": "https://www.facebook.com/sharer/sharer.php?u=%s",
        "linkedin": "https://www.linkedin.com/shareArticle?mini=true&url=%s",
        "twitter": "https://twitter.com/intent/tweet?text=Check%20out%20WikiWash,%20a%20tool%20for%20tracking%20edits%20on%20Wikipedia!&hashtags=wikiwash&related=twg,metrotoronto,CIRonline&url=%s"
      };

      $scope.shareUrl = function(url) {
        return url.replace(/%s/, $window.escape($location.absUrl()));
      };

      $scope.openTarget = function(url) {
        return url.match(/^https?:/) ? '_blank' : '';
      };
    }
  };
}]);
