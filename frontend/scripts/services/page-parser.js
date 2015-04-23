angular.module('wikiwash').factory('pageParser', function() {
  return {
    getParamsForPage: function(pageName) {
      var options = {
        site: 'en.wikipedia.org',
        page: pageName
      };

      if (pageName.match(/^https?:\/\//)) {
        var parser = document.createElement('a');

        parser.href = pageName;

        var pathParts = parser.pathname.split('/');

        options.site = parser.hostname.split('.')[0] + '.wikipedia.org';
        options.page = decodeURI(pathParts[pathParts.length - 1]);
      }

      options.page = options.page.replace(/ /g, "_");

      return options;
    }
  };
});
