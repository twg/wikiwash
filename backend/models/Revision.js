// == Imports ===============================================================

var _ = require('lodash');
var Q = require('q');
var DiffFormatter = require('../helpers/DiffFormatter');
var WikipediaHelper = require('../helpers/WikipediaHelper');
var log = require('../config/log').createLoggerForFile(__filename);

var PageProcessor = require('../helpers/PageProcessor');

// == Exported Functions ====================================================

function find(revisionIDs, options) {
  if (!Array.isArray(revisionIDs)) {
    revisionIDs = [ revisionIDs ];
  }

  return WikipediaHelper.getAndCacheRevisions(revisionIDs, options)
    .then(function(blobs) {
      if (blobs.length === 2) {
        var prevHtml = blobs[1];
        var revHtml = blobs[0];

        return new DiffFormatter(revHtml, prevHtml).generateDiff();
      } else {
        return {
          content: blobs[0],
          added: 0,
          removed: 0
        };
      }
    }).then(function(data) {
      data.content = PageProcessor.process(data.content);

      return data;
    });
}

// == Exports ===============================================================

module.exports = {
  find: find
};
