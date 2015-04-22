var _ = require('lodash');
var DiffFormatter = require('../helpers/DiffFormatter');
var WikipediaHelper = require('../helpers/WikipediaHelper');
var log = require('../config/log').createLoggerForFile(__filename);

var PageProcessor = require('../helpers/PageProcessor');

function find(revisionIDs, options, callback) {
  if (!Array.isArray(revisionIDs)) {
    revisionIDs = [ revisionIDs ];
  }

  WikipediaHelper.getAndCacheRevisions(revisionIDs, options).then(function(blobs) {
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

    callback(undefined, data);
  }).catch(function(err) {
    log.error(err);

    callback(err, {
      content: "An error occurred.",
      added: 0,
      removed: 0
    });
  });
}

module.exports = {
  find: find
};
