// == Imports ===============================================================

var log = require('../config/log').createLoggerForFile(__filename);
var fs = require("q-io/fs");
var path = require('path');

var TopArticles = require('../helpers/TopArticles');

// == Constants =============================================================

//  Rather than add a database as a dependency, here we just
//  reference a single JSON blob of the most recent Wiki articles.
var suggestionsFilename = path.join(
  __dirname, '../../data', TopArticles.topArticlesFilename
);

// == Exported Classes ======================================================

function SuggestionsController() {
  this.cache = [ ];
  this.lastMtime = 0;
}

SuggestionsController.prototype.index = function(options) {
  var _this = this;

  return fs.stat(suggestionsFilename)
    .then(function(stats) {
      if (stats.mtime == _this.lastMtime) {
        return _this.cache;
      }

      return fs.readFile(suggestionsFilename).then(function(data) {
        _this.lastMtime = stats.mtime;
        _this.cache = JSON.parse(data.toString());

        return _this.cache;
      });
    })
    .catch(function(err) {
      log.warn("Could not load suggestion data: " + err.toString());
    });
};

// == Exports ===============================================================

module.exports = SuggestionsController;
