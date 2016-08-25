var _ = require('lodash');
var WikipediaHelper = require('../helpers/WikipediaHelper');
var log = require('../config/log').createLoggerForFile(__filename);

var PageProcessor = require('../helpers/PageProcessor');

module.exports.find = function (revisionIDs, callback) {
  if (!Array.isArray(revisionIDs)) {
    revisionIDs = [ revisionIDs ];
  }

  WikipediaHelper.getRevisionsDiff(revisionIDs).then(function(data) {
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
};
