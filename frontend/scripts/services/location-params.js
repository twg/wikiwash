angular.module('wikiwash').factory('locationParams',
  function($location) {
    return {
      getWikipediaSite: function() {
        return window.locale.current() + '.wikipedia.org';
      },
      getCurrentRevId: function() {
        if ($location.path().split("/").length > 2) {
          return $location.path().split("/")[2].split("-")[0];
        }
        
        return null;
      },
      getPage: function() {
        if ($location.path().split("/").length > 1) {
          return $location.path().split("/")[1];
        }

        return null;
      }
    };
  }
);
