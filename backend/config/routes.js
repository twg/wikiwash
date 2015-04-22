var path = require('path');
var csv  = require('express-csv');

var root = path.join(__dirname, '..', '..', 'public', 'views');

var RevisionsController = require('../controllers/RevisionsController');
var SuggestionsController = require('../controllers/SuggestionsController');

var config = require('./config');

module.exports = function(app, io) {
  app.get('/api/revisions/:id', function(req, res) {
    var revisionId = req.params.id;

    if (req.query.diff) {
      revisionId = [ revisionId, req.query.diff ];
    }

    RevisionsController.show(revisionId, { site: config.wikipediaSite }, function(err, data) {
      res.json(data);
    });
  });

  app.get('/api/suggestions', function(req, res) {
    SuggestionsController.index(function(err, data) {
      res.json(data);
    });
  });
  
  app.get('/docs', function(req, res) {
    res.sendfile('docs.html', { root: root });
  });

  app.get('/', function(req, res) {
    res.sendfile('index.html', { root: root });
  });

  app.all('/*', function(req, res) {
    res.redirect('/#!' + req.path);
  });
};
