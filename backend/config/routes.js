// == Imports ===============================================================

var path = require('path');
var csv  = require('express-csv');

var root = path.join(__dirname, '..', '..', 'public', 'views');

var RevisionsController = require('../controllers/RevisionsController');
var SuggestionsController = require('../controllers/SuggestionsController');

var config = require('./config');

// == Support Functions ======================================================

function wikipediaSite(req) {
  var first = req.host.split('.')[0];

  switch (first) {
    case 'en':
    case 'fr':
    case 'de':
      return first + 'wikipedia.org';
    default:
      return config.wikipediaSite;
  }
}

// == Routes ================================================================

var router = require('express')();

var revisionsController = new RevisionsController();

router.get('/api/revisions/:id', function(req, res) {
  var revisionId = req.params.id;

  if (req.query.diff) {
    revisionId = [ revisionId, req.query.diff ];
  }

  revisionsController.show(revisionId, { site: wikipediaSite(req) })
    .then(function(data) { 
      res.json(data);
    });
});

var suggestionsController = new SuggestionsController();

router.get('/api/suggestions', function(req, res) {
  suggestionsController.index({ site: wikipediaSite(req) })
    .then(function(data) {
      res.json(data);
    });
});

router.get('/docs', function(req, res) {
  res.sendfile('docs.html', { root: root });
});

router.get('/', function(req, res) {
  res.sendfile('index.html', { root: root });
});

router.all('/*', function(req, res) {
  res.redirect('/#!' + req.path);
});

// == Exports ===============================================================

module.exports = router;
