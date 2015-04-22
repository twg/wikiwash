var config = require('../config/config');
var log = require('../config/log').createLoggerForFile(__filename);
var _ = require('lodash');

var Page = require('../models/Page');

function PagesController() {
  this.currentRevisionIds = [ ];
  this.cycling = true;
}

PagesController.prototype.show = function(pageName) {
  var _this = this;

  return Page.findRevisions(pageName, this.currentRevisionIds, { site: config.wikipediaSite })
    .then(function(pageData) {
      if (!pageData.revisions.length) {
        return { };
      }

      var ids = pageData.revisions.map(function(revision) {
        return revision.revid;
      });

      _this.currentRevisionIds = _this.currentRevisionIds.concat(ids);

      return pageData;
    });
};

module.exports = PagesController;
