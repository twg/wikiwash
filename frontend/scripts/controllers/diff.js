/* global angular */

angular.module('wikiwash').controller('DiffController',[
  '$scope', '$sce', '_', 'revision',
  function($scope, $sce, _, revision) {
    $scope.$parent.loading = false;
    $scope.$parent.revisionBody = $sce.trustAsHtml(revision.data.content); 
    $scope.$parent.showAdded = true;
    $scope.$parent.showRemoved = true;
    $scope.$parent.editCount = revision.data.editCount;
    $scope.$parent.nextEdit = 0;
    
    var updateCurrentRevisionStats = function () {
      var currentRev = _.find($scope.$parent.revisions, function (rev) {
        return rev.revid == $scope.$parent.currentRevId;
      });
      
      if (currentRev) {
        currentRev.added = revision.data.added;
        currentRev.removed = revision.data.removed;
      }
    };
    
    updateCurrentRevisionStats();
  }
]);
