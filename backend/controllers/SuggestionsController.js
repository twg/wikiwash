var log = require('../config/log').createLoggerForFile(__filename);
var fs = require("q-io/fs");
var path = require('path');

var TopArticles = require('../helpers/TopArticles');

//  Rather than add a database as a dependency, here we just
//  reference a single JSON blob of the most recent Wiki articles.
var suggestionsFilename = path.join(__dirname, '..', '..', 'data', TopArticles.topArticlesFilename);

var suggestionsCache = [ ];
var suggestionsLastMtime = 0;

module.exports.index = function(options) {
  return fs.stat(suggestionsFilename)
    .then(function(stats) {
      if (stats.mtime == suggestionsLastMtime) {
        return suggestionsCache;
      }

      return fs.readFile(suggestionsFilename).then(function(data) {
        suggestionsLastMtime = stats.mtime;
        suggestionsCache = JSON.parse(data.toString());

        return suggestionsCache;
      });
    })
    .catch(function(err) {
      log.warn("Could not load suggestion data: " + err.toString());
    });
};
