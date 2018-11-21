/*global angular  */
angular.module('wikiwash').controller('PagesController',
  ['$scope', '$location', '$routeParams', '$routeSegment', '$http',
    '$anchorScroll', 'locationParams', 'socketService', '_', 'pageParser',
  function(
    $scope,
    $location,
    $routeParams,
    $routeSegment,
    $http,
    $anchorScroll,
    locationParams,
    socketService,
    _,
    pageParser) {

    var updateStats = function() {
      var users = _.keys(_.groupBy($scope.revisions, function(revision) {
        return revision.user;
      }));

      $scope.totalUsers = users.length;
      $scope.editsPerUser = Math.round(10 * ($scope.revisions.length / users.length)) / 10;

      var end = new Date($scope.revisions[0].timestamp);
      var start = new Date(_.last($scope.revisions).timestamp);

      var diffHours = (((end - start) / 1000) / 3600);

      $scope.timeBetweenEdits = Math.round(10 * (diffHours / $scope.revisions.length)) / 10;
      $scope.firstEditDate = _.last($scope.revisions).timestamp;
    };

    $scope.revisions = [ ];
    $scope.loading = true;
    $scope.revisionBody = "";
    $scope.showAdded = true;
    $scope.showRemoved = true;

    $scope.editsPerUser = 0;
    $scope.totalUsers = 0;
    $scope.editCount = 0;
    $scope.timeBetweenEdits = 0;
    $scope.nextEdit = 0;
    $scope.tab = 'history';

    socketService.socket.emit('cycle page data', {
      page: locationParams.getPage()
    });
    socketService.cycling = true;

    $scope.$watch('loading', function() {
      $scope.pageName = decodeURIComponent(locationParams.getPage()).replace(/_/g, ' ');
      $scope.pageTitle = $scope.pageName;
      $scope.currentRevId = locationParams.getCurrentRevId();
      $scope.csv_filename = $scope.pageName.replace(/ /g, '_').replace(/[^\w]/g, '') + '.csv';

      if ($scope.loading) {
        $scope.revisionBody = "";
      }
    });

    $scope.$on('$routeChangeSuccess', function(event, next, prev) {
      if (JSON.stringify(next.pathParams) == JSON.stringify(prev.pathParams)) {
        return;
      }

      if ($routeParams.revId) {
        // want to allow clicking relative links to other wikipedia pages
        // links look like: '/wiki/thing'
        // edge case is the page for "wiki"
        // revisions for that page look like '/wiki/1111-2222'
        if ($routeParams.page == 'wiki') {
          if (!parseInt($routeParams.revId.split('-')[0])) {
            socketService.socket.emit('stop cycle');

            $routeParams.page = $routeParams.revId;
            $location.path($routeParams.revId).replace();
            $routeSegment.chain[0].reload();

            return;
          }
        }

        $scope.currentRevId = locationParams.getCurrentRevId();

        if ($routeSegment.chain.length > 1) {
          $routeSegment.chain[1].reload();
        }
      }
    });

    $scope.$on('$routeChangeStart', function(event, next, prev) {
      if (JSON.stringify(next.pathParams) == JSON.stringify(prev.pathParams) && $location.hash()) {
        $anchorScroll();
      }
      else {
        $scope.loading = true;
      }
    });

    $scope.$watch('revisions', function(revisions) {
      // This is not permanent, will fix soon
      if (revisions.length > 50) {
        new WOW().init();
      }
    });

    socketService.socket.on("new revisions", function(res) {
      var revs = res.revisions || [ ];

      $scope.revisions = revs.concat($scope.revisions);
      
      if ($scope.revisions.length === 0) {
        $scope.loading = false;
        $scope.noResults = true;
        return;
      }

      // redirect to first revision
      if (!$routeParams.revId) {
        $scope.revisions = res.revisions;

        var revId = $scope.revisions[0].revid + "-" + $scope.revisions[0].parentid;
        var params = {
          page: $routeParams.page,
          revId: revId
        };

        $location.path($routeSegment.getSegmentUrl('p.revision', params)).replace();
      }

      updateStats();
    });

    $scope.$watch('showRemoved', function() {
      if ($scope.showRemoved) {
        $('.subtractions').css('display', 'inline');
      } else {
        $('.subtractions').css('display', 'none');
      }
    });

    $scope.$watch('showAdded', function() {
      if ($scope.showAdded) {
        $('.additions').css('display', 'inline');
      } else {
        $('.additions').css('display', 'none');
      }
    });

    $scope.getNewPage = function() {
      socketService.socket.emit('stop cycle');

      var params = {
        page: pageParser.getPageName($scope.pageName)
      };

      $location.path($routeSegment.getSegmentUrl('p', params)).replace();
      $routeSegment.chain[0].reload();
    };

    $scope.incNextEdit = function() {
      if ($scope.nextEdit < $scope.editCount - 1) {
        $scope.nextEdit++;
      }
    };

    $scope.decNextEdit = function() {
      if ($scope.nextEdit > 0) {
        $scope.nextEdit--;
      }
    };

    $scope.sessionCsv = function() {
      var csv = [
        [ 'Revision ID', 'User', 'Minor', 'Timestamp', 'Size', 'Rev Url' ]
      ];

      $scope.revisions.forEach(function(rev) {
        csv.push([
          rev.revid,
          rev.user,
          rev.minor,
          rev.timestamp,
          rev.size,
          rev.permanentLink,
        ]);
      });

      return csv;
    };

    $scope.showRevision = function(args) {
      args.page = encodeURIComponent(args.page);

      $scope.tab = 'article';
      $location.path($routeSegment.getSegmentUrl('p.revision', args));
    };

    $scope.showHistory = function() {
      $scope.tab = 'history';
    };

    $scope.showArticle = function() {
      $scope.tab = 'article';
    };
  }
]);
