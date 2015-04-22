var log = require('../config/log').createLoggerForFile(__filename);
var Revision = require('../models/Revision');

function show(revisionId, options, callback) {
  Revision.find(revisionId, options, function(err, data) {
    callback(err, data);
  });
}

module.exports = {
  show: show
};
