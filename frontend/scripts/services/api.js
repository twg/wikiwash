/* global angular */

angular.module('wikiwash').factory('api', ['$http', function($http) {
  function getRequestPromise(url) {
    return $http({
      method: 'GET',
      url: url,
    }).success(function(data, status, headers, config) {
      return data;
    })
    .error(function (data, status, headers, config) {
      return "ERROR: " + status;
    });
  }
  
  return {
    getRevision: function(revId) {
      var revIds = revId.split("-");

      var url = "/api/revisions/" + revIds[0];

      if (revIds.length > 1 && revIds[1] !== '0') {
        url = url + "?diff=" + revIds[1];
      }
      
      return getRequestPromise(url);
    },

    getSearchSuggestions: function() {
      return getRequestPromise("/api/suggestions");
    }
  };
}]);
