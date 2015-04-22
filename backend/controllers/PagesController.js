var config = require('../config/config');
var log = require('../config/log').createLoggerForFile(__filename);
var _ = require('lodash');

var Page = require('../models/Page');

function PagesController() {
  this.currentRevisionIds = [ ];
  this.cycling = true;
}

PagesController.prototype.show = function(pageName, callback) {
  var _this = this;

  Page.findRevisions(pageName, this.currentRevisionIds, { site: config.wikipediaSite }, function(err, pageData) {
    if (pageData.revisions.length) {
      var ids = pageData.revisions.map(function(revision) {
        return revision.revid;
      });

      _this.currentRevisionIds = _this.currentRevisionIds.concat(ids);

      callback(undefined, pageData);
    } else {
      callback(undefined, { });
    }
  });
};

module.exports = PagesController;
