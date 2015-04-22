var helper = require('../helper');
var expect = helper.expect;

var DiffFormatter = require('../../helpers/DiffFormatter');

//  For tests, remove unnecessary whitespace from HTML.
var normalizeHTML = function(html) {
  return html.replace(/ +/g, ' ').replace(/> /g, '>').replace(/ </g, '<');
};

describe('DiffFormatter', function(done) {
  describe('constructor', function() {
    it('should create an empty formatter', function() {
      var f = new DiffFormatter("", "");
      expect(f.contentParts).to.eql([]);
      expect(f).to.have.property('editCount', 0);
      expect(f).to.have.property('totalAdded', 0);
      expect(f).to.have.property('totalRemoved', 0);
    });
  });

  describe('diff generation', function() {
    it('should create a diff for plain text', function() {
      var a = "Hello World";
      var b = "Hallo Warld";

      var diff = new DiffFormatter(a, b).generateDiff();
      expect(diff).to.have.property('added', 2);
      expect(diff).to.have.property('removed', 2);
      expect(diff).to.have.property('editCount', 4);

      var expectedDiff = [
        'H',
        '<span class="ww-edit subtractions" id="edit-0">a</span>',
        '<span class="ww-edit additions" id="edit-1">e</span>',
        'llo W',
        '<span class="ww-edit subtractions" id="edit-2">a</span>',
        '<span class="ww-edit additions" id="edit-3">o</span>',
        'rld',
      ].join('');

      expect(diff).to.have.property('content', expectedDiff);
    });

    it('should create a diff for basic HTML tags', function() {
      var a = "<div class='class1'>test</div>";
      var b = "<div class='class2'>test</div>";

      var diff = new DiffFormatter(b, a).generateDiff();
      expect(diff).to.have.property('added', 30);
      expect(diff).to.have.property('removed', 30);
      expect(diff).to.have.property('editCount', 2);

      var expectedDiff = [
        '<span class="ww-edit subtractions" id="edit-0"> <div class=\'class1\'>test</div> </span>',
        '<span class="ww-edit additions" id="edit-1"> <div class=\'class2\'>test</div> </span>',
      ].join('');

      expect(diff).to.have.property('content', expectedDiff);
    });

    describe('on real content', function() {
      //  Excerpts of test content below taken from Wikipedia's "Rob Ford" article
      //  http://en.wikipedia.org/w/index.php?title=Rob_Ford&oldid=632623619
      var a = [
        '<p>',
        '  The judge never explained the comment, although it was widely reported.',
        '  <sup id="cite_ref-gm-2014-01-29_31-0" class="reference">',
        '    <a href="#cite_note-gm-2014-01-29-31">',
        '      <span>',
        '        [',
        '      </span>',
        '      31',
        '      <span>',
        '        ]',
        '      </span>',
        '    </a>',
        '  </sup>',
        '  Ford told the',
        '  <i>',
        '    Toronto Sun',
        '  </i>',
        '  that the allegations were "far-fetched" and "way out there."',
        '  <sup id="cite_ref-gm-2014-01-29_31-1" class="reference">',
        '    <a href="#cite_note-gm-2014-01-29-31">',
        '      <span>',
        '        [',
        '      </span>',
        '      31',
        '      <span>',
        '        ]',
        '      </span>',
        '    </a>',
        '  </sup>',
        '</p>',
      ].join('');

      var b = [
        '<p>',
        '  The judge never explained the comment, although it was widely reported.',
        '  Ford\'s lawyer described the allegation as "insanity".',
        '  <sup id="cite_ref-gm-2014-01-29_31-0" class="reference">',
        '    <a href="#cite_note-gm-2014-01-29-31">',
        '      <span>',
        '        [',
        '      </span>',
        '      31',
        '      <span>',
        '        ]',
        '      </span>',
        '    </a>',
        '  </sup>',
        '</p>',
      ].join('');

      it('should create a diff for more complex, nested HTML tags', function() {
        var diff = new DiffFormatter(b, a).generateDiff();
        var expectedDiff = [
          '<p>',
          '  The judge never explained the comment, although it was widely reported.',
          '  <span class="ww-edit subtractions" id="edit-0">',
          '    <sup id="cite_ref-gm-2014-01-29_31-0" class="reference">',
          '      <a href="#cite_note-gm-2014-01-29-31">',
          '        <span>',
          '          [',
          '        </span>',
          '        31',
          '        <span>',
          '          ]',
          '        </span>',
          '      </a>',
          '    </sup>',
          '  </span>',
          '  <span class="ww-edit subtractions" id="edit-1">',
          '    Ford told the',
          '  </span>',
          '  <span class="ww-edit subtractions" id="edit-2">',
          '    <i>Toronto Sun</i> ',
          '  </span>',
          '  <span class="ww-edit subtractions" id="edit-3">',
          '    that the allegations were "far-fetched" and "way out there."',
          '  </span>',
          '  <span class="ww-edit additions" id="edit-4">',
          '    Ford\'s lawyer described the allegation as "insanity".',
          '  </span>',
          '  <span class="ww-edit subtractions" id="edit-5">',
          '    <sup id="cite_ref-gm-2014-01-29_31-1" class="reference">',
          '      <a href="#cite_note-gm-2014-01-29-31">',
          '        <span>',
          '          [',
          '        </span>',
          '        31',
          '        <span>',
          '          ]',
          '        </span>',
          '      </a>',
          '    </sup>',
          '  </span>',
          '  <span class="ww-edit additions" id="edit-6">',
          '    <sup id="cite_ref-gm-2014-01-29_31-0" class="reference">',
          '      <a href="#cite_note-gm-2014-01-29-31">',
          '        <span>',
          '          [',
          '        </span>',
          '        31',
          '        <span>',
          '          ]',
          '        </span>',
          '      </a>',
          '    </sup>',
          '  </span>',
          '</p>',
        ].join('');

        expect(normalizeHTML(diff.content)).to.eql(normalizeHTML(expectedDiff));
      });

      it('should create a diff for more complex, nested HTML tags without whitespace', function() {
        var diff = new DiffFormatter(normalizeHTML(b), normalizeHTML(a)).generateDiff();
        var expectedDiff = [
          '<p>',
          '  The judge never explained the comment, although it was widely reported.',
          '  <span class="ww-edit subtractions" id="edit-0">',
          '    <sup id="cite_ref-gm-2014-01-29_31-0" class="reference">',
          '      <a href="#cite_note-gm-2014-01-29-31">',
          '        <span>',
          '          [',
          '        </span>',
          '        31',
          '        <span>',
          '          ]',
          '        </span>',
          '      </a>',
          '    </sup>',
          '  </span>',
          '  <span class="ww-edit subtractions" id="edit-1">',
          '    Ford told the',
          '  </span>',
          '  <span class="ww-edit subtractions" id="edit-2">',
          '    <i>Toronto Sun</i>',
          '  </span>',
          '  <span class="ww-edit subtractions" id="edit-3">',
          '    that the allegations were "far-fetched" and "way out there."',
          '  </span>',
          '  <span class="ww-edit subtractions" id="edit-4">',
          '    <sup id="cite_ref-gm-2014-01-29_31-1" class="reference">',
          '      <a href="#cite_note-gm-2014-01-29-31">',
          '        <span>',
          '          [',
          '        </span>',
          '        31',
          '        <span>',
          '          ]',
          '        </span>',
          '      </a>',
          '    </sup>',
          '  </span>',
          '  <span class="ww-edit additions" id="edit-5">',
          '    Ford\'s lawyer described the allegation as "insanity".',
          '    <sup id="cite_ref-gm-2014-01-29_31-0" class="reference">',
          '      <a href="#cite_note-gm-2014-01-29-31">',
          '        <span>',
          '          [',
          '        </span>',
          '        31',
          '        <span>',
          '          ]',
          '        </span>',
          '      </a>',
          '    </sup>',
          '  </span>',
          '</p>',
        ].join('');

        expect(normalizeHTML(diff.content)).to.eql(normalizeHTML(expectedDiff));
      });
    });
  });
});
