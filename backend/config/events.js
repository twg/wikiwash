var PagesController = require('../controllers/PagesController');

var log = require('./log').createLoggerForFile(__filename);

var delay = 30000;

function emitPageData(pageName, pages, socket) {
  if (!socket.connected || !pages.cycling) {
    return;
  }

  pages.show(pageName).then(function(pageData) {
    socket.emit('new revisions', pageData);
  });

  setTimeout(function() {
    emitPageData(pageName, pages, socket);
  }, delay);
}

module.exports = function(io) {
  io.on('connection', function(socket) {
    log.info('Connection from ' + socket.conn.remoteAddress);
    
    var pages = new PagesController();

    socket.on('cycle page data', function(params) {
      emitPageData(params.page, pages, socket);
      
      socket.on('stop cycle', function() {
        pages.cycling = false;
      });
    });
    
    socket.on('disconnect', function() {
      log.info("user disconnected");
    });
  });
};
