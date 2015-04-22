var helper = require('../helper');
var expect = helper.expect;

var HTMLDiffProcessor = require('../../helpers/HTMLDiffProcessor');

describe('HTMLDiffProcessor', function(done) {
  describe('constructor', function() {
    it('should create an empty processor', function() {
      var p = new HTMLDiffProcessor();
      expect(p.htmlFromPlainText("test")).to.eql("test");
    });
  });

  describe('html stripping', function() {
    it('should process a string with no tags', function() {
      var p = new HTMLDiffProcessor();
      expect(p.plainTextFromHTML("test")).to.eql("test");
    });

    it('should process a string with one tag', function() {
      var p = new HTMLDiffProcessor();
      var result = p.plainTextFromHTML("<tag>");
      expect(result).to.not.include("<tag>");
      expect(result).to.have.length(1);
    });

    it('should process a string with two tags', function() {
      var p = new HTMLDiffProcessor();
      var result = p.plainTextFromHTML("<tag></tag>");
      expect(result).to.not.include("<tag>");
      expect(result).to.not.include("</tag>");
      expect(result).to.have.length(2);
    });
  });

  describe('html restoration', function() {
    it('should process a string with no tags', function() {
      var p = new HTMLDiffProcessor();
      expect(p.htmlFromPlainText(p.plainTextFromHTML("test"))).to.eql("test");
    });

    it('should process a string with one tag', function() {
      var p = new HTMLDiffProcessor();
      var result = p.htmlFromPlainText(p.plainTextFromHTML("<tag>"));
      expect(result).to.eql("<tag>");
    });

    it('should process a string with two tags', function() {
      var p = new HTMLDiffProcessor();
      var result = p.htmlFromPlainText(p.plainTextFromHTML("<tag></tag>"));
      expect(result).to.eql("<tag></tag>");
    });

    it('should process a string with tags that were not converted', function() {
      var p = new HTMLDiffProcessor();
      var plainEncoded = p.plainTextFromHTML("<tag></tag>");
      var result = p.htmlFromPlainText(plainEncoded + "<other />");
      expect(result).to.eql("<tag></tag><other />");
    });

    it('should process a string with unknown Unicode characters', function() {
      var p = new HTMLDiffProcessor();
      var plainEncoded = p.plainTextFromHTML("<tag></tag>");
      var result = p.htmlFromPlainText(plainEncoded + "\uE003");
      expect(result).to.eql("<tag></tag>\uE003");
    });

    it('should process a string containing Unicode characters', function() {
      var p = new HTMLDiffProcessor();
      var snowman = "\u2603";
      var result = p.htmlFromPlainText(p.plainTextFromHTML("<tag>" + snowman + "</tag>"));
      expect(result).to.eql("<tag>" + snowman + "</tag>");
    });

    it('should rely only on internal state', function() {
      var p = new HTMLDiffProcessor();
      var plainEncoded = p.plainTextFromHTML("<tag></tag>");

      var p2 = new HTMLDiffProcessor();
      var result = p2.htmlFromPlainText(plainEncoded);
      expect(result).not.to.eql("<tag></tag>");
    });
  });

  describe('reset', function() {
    it('should reset internal state', function() {
      var p = new HTMLDiffProcessor();
      var plainEncoded = p.plainTextFromHTML("<tag></tag>");
      p.reset();
      var result = p.htmlFromPlainText(plainEncoded);
      expect(result).to.not.eql("<tag></tag>");
    });
  });
});