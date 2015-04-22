var log = require('../config/log').createLoggerForFile(__filename);
var Revision = require('../models/Revision');

function show(revisionId, options) {
  return Revision.find(revisionId, options);
}

module.exports = {
  show: show
};
