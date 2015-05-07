angular.module('wikiwash').config(
  function($routeProvider, $routeSegmentProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeSegmentProvider
      .when('/', 's')
      .when('/:page', 'p')
      .when('/:page/:revId', 'p.revision')
      .segment('s', {
        templateUrl: '/views/partials/search.html',
        controller: 'HomeController',
        resolve: {
          suggestions: function(api) {
            return api.getSearchSuggestions();
          },
        },
      })
      .segment('p', {
        templateUrl: '/views/partials/page-revisions.html',
        controller: 'PagesController'
      })
      .within()
        .segment('revision', {
          templateUrl: '/views/partials/revision.html',
          controller: 'DiffController',
          resolve: {
            revision: function($route, api) {
              return api.getRevision($route.current.params.revId);
            }
          },
          resolveFailed: {
            templateUrl: 'errors/error.html',
            controller: 'ErrorController'
          }
        });
  }
);
