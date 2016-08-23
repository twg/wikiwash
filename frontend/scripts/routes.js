/* global angular */

angular.module('wikiwash').config([
  '$routeProvider', '$routeSegmentProvider', '$locationProvider',
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
          suggestions: [ 'api', function(api) {
            return api.getSearchSuggestions();
          }],
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
            revision: [
              '$route',
              'api',
              function($route, api) {
                return api.getRevision($route.current.params.revId);
              }
            ]
          },
          resolveFailed: {
            templateUrl: 'templates/error.html',
            controller: 'ErrorController'
          }
        });
  }
]);
