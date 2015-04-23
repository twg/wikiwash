// HTML Diff Processor
// ===================
//
// This class allows the conversion of HTML to plaintext, replacing each tag
// with a Unicode character not in public usage, to allow for the use of standard
// diff algorithms on the resulting HTML. Note that after using this class,
// any resulting HTML may still be invalid - although it is guaranteed not to contain
// *syntactically* invalid HTML, it may contain *semantically* invalid HTML
// (i.e.: improperly nested tags, missing closing or starting tags, etc.)

// == Constants =============================================================

//  0xE000 is the start of the private use area in the Unicode Standard
DefaultCharacterCode = 0xE000;

// == Exported Classes ======================================================

function HTMLDiffProcessor() {
  this.tagToCharacterMap = {};
  this.characterToTagMap = {};
  this.currentCharacterCode = DefaultCharacterCode;
}

HTMLDiffProcessor.prototype.getCharForTag = function(tag) {
  if (!(tag in this.tagToCharacterMap)) {
    var character = String.fromCharCode(this.currentCharacterCode++);

    this.tagToCharacterMap[tag] = character;
    this.characterToTagMap[character] = tag;

    return character;
  } else {
    return this.tagToCharacterMap[tag];
  }
};

HTMLDiffProcessor.prototype.reset = function() {
  this.tagToCharacterMap = { };
  this.characterToTagMap = { };
  this.currentCharacterCode = DefaultCharacterCode;
};

HTMLDiffProcessor.prototype.plainTextFromHTML = function(html) {
  return html.replace(/<(S*?)[^>]*>.*?|<.*?\/>/g, this.getCharForTag.bind(this));
};

HTMLDiffProcessor.prototype.htmlFromPlainText = function(plain) {
  var output = [ ];

  for (var i = 0; i < plain.length; i++) {
    if (plain.charCodeAt(i) >= DefaultCharacterCode) {
      var tag = this.characterToTagMap[plain[i]];
      if (tag) {
        output.push(tag);
      } else {
        output.push(plain[i]);
      }
    } else {
      output.push(plain[i]);
    }
  }

  return output.join('');
};

// == Exports ===============================================================

module.exports = HTMLDiffProcessor;
