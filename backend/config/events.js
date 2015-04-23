// == Imports ===============================================================

var config = require('./config');
var PagesController = require('../controllers/PagesController');

var log = require('./log').createLoggerForFile(__filename);

// == Constants =============================================================

var refreshInterval = 30000;

// REFACTOR: The interface between PagesController and this component is
//           somewhat wobbly, especially the refresh timer part.

// == Support Functions =====================================================

function updatePage(pageName, pagesController, socket, _options) {
  if (!socket.connected || !pagesController.timer) {
    return;
  }

  var options = {
    site: _options && _options.site || config.wikipediaSite
  };

  log.info('Page cycle request: ' + pageName + ' ' + JSON.stringify(_options));

  pagesController.show(pageName, options)
    .then(function(pageData) {
      log.info('Page cycle finished: ' + pageName);

      socket.emit('new revisions', pageData);
    })
}

function clearPageUpdate(pagesController) {
  if (pagesController.timer) {
    clearTimeout(pagesController.timer);
    pagesController.timer = null;
  }
}

// == Exports ===============================================================

module.exports = function(io) {
  io.on('connection', function(socket) {
    log.info('Connection from ' + socket.conn.remoteAddress);
    
    var pagesController = new PagesController();

    socket.on('cycle page data', function(params) {
      clearPageUpdate(pagesController);

      var updateFn = function() {
        updatePage(params.page, pagesController, socket, params);
      }
      
      pagesController.timer = setTimeout(updateFn, refreshInterval);
      updateFn();
      
      socket.on('stop cycle', function() {
        clearPageUpdate(pagesController);
      });
    });
    
    socket.on('disconnect', function() {
      log.info("user disconnected");

      clearPageUpdate(pagesController);
    });
  });
};
