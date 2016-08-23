/* global angular */

angular.module('wikiwash')
  .directive(
    'fixedHeight',
    ['$window', function($window) {
      return {
        scope: {
          offset: "@"
        },
        link: function (scope, element) {
          var resizeHandler = function() {
            element.height($window.innerHeight - scope.offset - 28);
          };

          angular.element($window).bind('resize', resizeHandler);

          resizeHandler();
        }
      };
    }
  ]);