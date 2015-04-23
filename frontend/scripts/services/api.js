angular.module('wikiwash').factory('api', function($http) {
  function getRequestPromise(url) {
    return $http({
      method: 'GET',
      url: url,
    }).success(function(data, status, headers, config) {
      return data;
    })
    .error(function (data, status, headers, config) {
      console.log('Error: ' + status);

      return { error: status };
    });
  }
  
  return {
    getRevision: function(revId) {
      var revIds = revId.split("-");

      var url = "/api/revisions/" + revIds[0];

      if (revIds.length > 1 && revIds[1] !== '0') {
        url = url + "/" + revIds[1];
      }

      return getRequestPromise(url);
    },
    getSearchSuggestions: function() {
      return getRequestPromise("/api/suggestions");
    }
  };
});
