// == Imports ===============================================================

var request = require('request');
var zlib = require('zlib');
var fs = require('fs');
var moment = require('moment');
var Q = require('q');

// == Constants =============================================================

var ignore = [
  'Portal:', 'File:', 'Special:', 'Wikipedia:',
  'Talk:', 'Help:', 'User:', 'Category:', 'Data:',
  'index.php', 'index.html', '/', 'Main_Page',
];
var url_prefix = "http://dumps.wikimedia.org/other/pagecounts-raw/";
var limit = 15;

//  See: http://en.wikipedia.org/wiki/Wikipedia:Wikipedia_records#Article_with_longest_title
//
//  This will change over time, but if we exclude the longest wiki page name
//  from showing up on the homepage, that's not a big deal.
var longestPlausiblePageName = 217;

//  After trying this many HEAD requests, the findLatestDumpFile
//  method should return an error.
var maxDumpFileSearchDepth = 10;

// == Support Functions =====================================================

function compressedRequest(options) {
  var req = request(options);

  return req.pipe(zlib.createGunzip());
};

function parseLine(line) {
  var parts = line.split(' ');

  if (parts.length === 4) {
    return {
      language: parts[0],
      page: parts[1],
      requestCount: parseInt(parts[2], 10),
      size: parseInt(parts[3], 10),
    };
  } else {
    return null;
  }
};

function isRealPage(pageName) {
  if (pageName.length > longestPlausiblePageName) {
    return false;
  }

  for (var i = 0; i < ignore.length; i++) {
    if (pageName.indexOf(ignore[i]) === 0) {
      return false;
    }
  }

  return true;
};

function findLatestDumpFile(time, depth) {
  if (!time) {
    time = moment.utc();
  }

  if (!depth) {
    depth = 1;
  }

  var folders = time.format("YYYY") + "/" + time.format("YYYY-MM") + "/";
  var filename = "pagecounts-" + time.format("YYYYMMDD-HH") + "0000.gz";
  var url = url_prefix + folders + filename;
  var req = request.head({url: url});

  var deferred = Q.defer();
  req.on('response', function(response) {
    if (response.statusCode === 200) {
      deferred.resolve(url);
    } else {
      //  Recurse.
      depth++;
      if (depth > maxDumpFileSearchDepth) {
        deferred.reject("Could not find a suitable dump file after " + depth + " attempts.");
      } else {
        findLatestDumpFile(time.subtract(1, 'hour'), depth + 1).then(function(url) {
          deferred.resolve(url);
        }).fail(function(err) {
          deferred.reject(err);
        });
      }
    }
  });

  req.on('error', function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
}

// == Exported Classes ======================================================

function TopArticles(time) {
  return findLatestDumpFile(time).then(function(url) {
    var options = { url: url };
    var req = compressedRequest(options);

    var deferred = Q.defer();

    var histogram = { };

    var lineCache = "";

    req.on('data', function(data) {
      var lines = (lineCache + data.toString()).split("\n");
      lineCache = lines[lines.length - 1];

      for (var i = 0; i < lines.length - 1; i++) {
        var parsed = parseLine(lines[i]);

        if (parsed) {
          if (parsed.language === "en" && isRealPage(parsed.page)) {
            if (!(parsed.page in histogram)) {
              histogram[parsed.page] = 0;
            }

            histogram[parsed.page] += parsed.requestCount;
          }
        }
      }
    });

    req.on('end', function() {
      var sorted = [ ];

      for (var page in histogram) {
        sorted.push([ page, histogram[page] ]);
      }

      sorted.sort(function(a, b) {
        return a[1] - b[1];
      });

      sorted.reverse();
      deferred.resolve(sorted.slice(0, limit));
    });

    req.on('error', function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  });
}

TopArticles.topArticlesFilename = "topArticles.json";

// == Exports ===============================================================

module.exports = TopArticles;

// == Command-Line Stub =====================================================

//  If running this file directly on the command line, print out the data.
if (require.main === module) {
  TopArticles().then(function(data) {
    console.log(JSON.stringify(data, null, 2));
  });
}
