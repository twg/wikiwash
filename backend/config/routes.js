var path = require('path');
var csv  = require('express-csv');

var root = path.join(__dirname, '..', '..', 'public', 'views');

var RevisionsController = require('../controllers/RevisionsController');
var SuggestionsController = require('../controllers/SuggestionsController');

var config = require('./config');

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

var router = require('express')();

module.exports = router;

router.get('/api/revisions/:id', function(req, res) {
  var revisionId = req.params.id;

  if (req.query.diff) {
    revisionId = [ revisionId, req.query.diff ];
  }

  RevisionsController.show(revisionId, { site: wikipediaSite(req) })
    .then(function(data) { 
      res.json(data);
    });
});

router.get('/api/suggestions', function(req, res) {
  SuggestionsController.index({ site: wikipediaSite(req) })
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
