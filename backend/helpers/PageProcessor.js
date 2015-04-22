var cheerio = require('cheerio');

// FIX: Need to pass in the base URI used for this page so relative links
//      can be resolved properly.
function process(html) {
  var doc = cheerio.load(html);

  doc('a').each(function(i, _e) {
    var e = doc(_e);
    var href = e.attr('href');

    if (href.match(/File:/)) {
      // Image pages cannot be processed within the WikiWash application
      // FIX: Remove en. dependency
      href = 'http://en.wikipedia.org' + href;

      // Open in a new window
      e.attr('target', '_blank');
    }
    else {
      // Handle legacy Wikipedia URLs.
      href = href.replace(/^\/w\/index.php\?title=/, '/wiki/').replace(/\&.*/, '')
    }

    e.attr('href', href);
  })

  return doc.html();
}

module.exports = {
  process: process
};
