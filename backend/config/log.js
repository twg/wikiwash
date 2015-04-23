// == Imports ===============================================================

var bunyan = require('bunyan');
var path = require('path');

// == Exports ===============================================================

module.exports = {
  createLoggerForFile: function(fileName) {
    var loggerName = path.basename(fileName, '.js');
    
    return bunyan.createLogger({
      name: loggerName,
      level: (process.env.NODE_ENV === 'test') ? 'error' : 'info',
    });
  },
};
