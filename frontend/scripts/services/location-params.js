angular.module('wikiwash').factory('locationParams',
  function($location) {
    return {
      getWikipediaSite: function() {
        var language = location.hostname.split('.')[0];

        switch (language)
        {
          case 'en':
          case 'fr':
          case 'de':
            return language + '.wikipedia.org';
          default:
            return 'en.wikipedia.org';
        }
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
