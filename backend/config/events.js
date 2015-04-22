var config = require('./config');
var PagesController = require('../controllers/PagesController');

var log = require('./log').createLoggerForFile(__filename);

var refreshInterval = 30000;

// REFACTOR: The interface between PagesController and this component is
//           somewhat wobbly, especially the refresh timer part.

function emitPageData(pageName, pagesController, socket) {
  if (!socket.connected || !pagesController.cycling) {
    return;
  }

  log.info('Page cycle request: ' + pageName);

  pagesController.show(pageName, { site: config.wikipediaSite })
    .then(function(pageData) {
      log.info('Page cycle finished: ' + pageName);

      socket.emit('new revisions', pageData);
    })

  pagesController.timer = setTimeout(function() {
    emitPageData(pageName, pagesController, socket);
  }, refreshInterval);
}

module.exports = function(io) {
  io.on('connection', function(socket) {
    log.info('Connection from ' + socket.conn.remoteAddress);
    
    var pagesController = new PagesController();

    socket.on('cycle page data', function(params) {
      if (pagesController.timer) {
        clearTimeout(pagesController.timer);
        pagesController.timer = null;
      }

      emitPageData(params.page, pagesController, socket);
      
      socket.on('stop cycle', function() {
        if (pagesController.timer) {
          clearTimeout(pagesController.timer);
        }

        pagesController.timer = null;
      });
    });
    
    socket.on('disconnect', function() {
      log.info("user disconnected");
    });
  });
};
