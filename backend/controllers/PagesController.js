// == Imports ===============================================================

var config = require('../config/config');
var log = require('../config/log').createLoggerForFile(__filename);
var _ = require('lodash');

var Page = require('../models/Page');

// == Exported Classes ======================================================

function PagesController() {
  this.currentRevisionIds = [ ];
  this.cycling = true;
}

PagesController.prototype.show = function(pageName, _options) {
  var _this = this;

  var options = {
    site: _options ? _options.site : config.wikipediaSite
  }

  return Page.findRevisions(pageName, this.currentRevisionIds, options)
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

// == Exports ===============================================================

module.exports = PagesController;
