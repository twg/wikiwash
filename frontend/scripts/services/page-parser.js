/* global angular */

angular.module('wikiwash').factory('pageParser',[function() {
  return {
    getPageName: function (url) {
      return url.replace(/(en\.)?wikipedia.org\/wiki\//, "")
          .replace(/https?:\/\//, "")
          .replace(/ /g, "_");
    }
  };
}]);
