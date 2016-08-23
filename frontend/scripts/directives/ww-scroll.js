/* global angular */

angular.module('wikiwash')
  .directive('wwScroll',['SmoothScroll', function(SmoothScroll) {
    return {
      link: function(scope, element, attr) {
        var prevEdit = null;

        var scrollBuffer = 100;

        scope.$watch('nextEdit', function (current, last) {
          var edit = $('#edit-' + current);
          
          if (prevEdit) {
            if (prevEdit.hasClass('additions')) {
              prevEdit.css('background-color', '#B8E9D2');
            } else if (prevEdit.hasClass('subtractions')) {
              prevEdit.css('background-color', '#F1BCBC');
            }
          }

          if (edit.length > 0) {
            if (edit.hasClass('additions')) {
              edit.css('background-color', '#55f2a3');
            } else if (edit.hasClass('subtractions')) {
              edit.css('background-color', '#f99593');
            }

            setTimeout(function () {
              element.animate({
                scrollTop: (edit.offset().top - element.offset().top + element.scrollTop() - scrollBuffer)
              });
            }, 500);
          }
          
          prevEdit = edit;
        });
      }
    };
  }
]);
