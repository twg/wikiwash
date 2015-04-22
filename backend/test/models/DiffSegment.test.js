var helper = require('../helper');
var expect = helper.expect;

var DiffSegment = require('../../models/DiffSegment');

describe('DiffSegment', function(done) {
  describe('constructor', function() {
    it('should identify no addition or deletion', function() {
      var d = new DiffSegment([0, "abc"]);

      expect(d).to.have.property('isAddition', false);
      expect(d).to.have.property('isDeletion', false);
    });
    
    it('should identify addition', function() {
      var d = new DiffSegment([1, "abc"]);

      expect(d).to.have.property('isAddition', true);
      expect(d).to.have.property('isDeletion', false);
    });

    it('should identify deletion', function() {
      var d = new DiffSegment([-1, "abc"]);

      expect(d).to.have.property('isAddition', false);
      expect(d).to.have.property('isDeletion', true);
    });

    it('should identify no tag name', function() {
      var d = new DiffSegment([0, "abc"]);

      expect(d.tagName).to.eql(undefined);
    });

    it('should identify an opening tag name', function() {
      var d = new DiffSegment([0, "<abc>"]);

      expect(d.tagName).to.eql('abc');
    });

    it('should identify a closing tag name', function() {
      var d = new DiffSegment([0, "</abc>"]);

      expect(d.tagName).to.eql('abc');
    });

    it('should identify an example opening tag', function() {
      var d = new DiffSegment([0, "<abc>"]);

      expect(d.isOpeningTag).to.be.true;
      expect(d.isClosingTag).to.be.false;
    });

    it('should identify an example closing tag', function() {
      var d = new DiffSegment([0, "</abc>"]);

      expect(d.isClosingTag).to.be.true;
      expect(d.isOpeningTag).to.be.false;
    });

    it('should identify a p opening tag', function() {
      var d = new DiffSegment([0, "<p>"]);

      expect(d.isOpeningTag).to.be.true;
      expect(d.isClosingTag).to.be.false;
    });

    it('should identify a p closing tag', function() {
      var d = new DiffSegment([0, "</p>"]);
      
      expect(d.isClosingTag).to.be.true;
      expect(d.isOpeningTag).to.be.false;
    });

    it('should identify a self-closing tag', function() {
      var d = new DiffSegment([0, "<img />"]);

      expect(d.isClosingTag).to.be.true;
      expect(d.isOpeningTag).to.be.true;
    });
  });
});
