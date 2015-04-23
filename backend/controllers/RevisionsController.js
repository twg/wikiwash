// == Imports ===============================================================

var log = require('../config/log').createLoggerForFile(__filename);
var Revision = require('../models/Revision');

// == Exported Classes ======================================================

function RevisionsController() {
}

RevisionsController.prototype.show = function(revisionId, options) {
  return Revision.find(revisionId, options);
}

// == Exports ================================================================

module.exports = RevisionsController;
