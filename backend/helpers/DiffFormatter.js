// == Imports ===============================================================

var _ = require('lodash');
var gdiff = require('googlediff');

var log = require('../config/log').createLoggerForFile(__filename);
var HTMLDiffProcessor = require('../helpers/HTMLDiffProcessor');
var DiffSegment = require('../models/DiffSegment');

// == Support Functions =====================================================

var getDiffParts = function(revHtml, prevHtml) {
  var diff = new gdiff();
  var convert = new HTMLDiffProcessor();

  var file1 = convert.plainTextFromHTML(prevHtml);
  var file2 = convert.plainTextFromHTML(revHtml);

  var diffParts = diff.diff_main(file1, file2);
  diff.diff_cleanupSemantic(diffParts);

  var beforeFilter = +new Date();

  diffParts = _(diffParts)
    .reduce(function(acc, part) {
      var htmlChunk = convert.htmlFromPlainText(part[1]);
      var htmlTags = htmlChunk.split(/(<.*?>)/g);
      var newParts = _(htmlTags)
        .filter()
        .map(function(subpart) { return new DiffSegment([part[0], subpart]); })
        .value();
      return acc.concat(newParts);
    }, []);

  var afterFilter = +new Date();

  log.info("Filtering", diffParts.length, "differences took", (afterFilter - beforeFilter), "msec.");

  return diffParts;
};

var getOldContentString = function(parts) {
  return _(parts)
    .filter(function(part) { return !part.isAddition; })
    .map(function(part) { return part.content; })
    .toArray().join('');
};

var getNewContentString = function(parts) {
  return _(parts)
    .filter(function(part) { return !part.isDeletion; })
    .map(function(part) { return part.content; })
    .toArray().join('');
};

// == Exported Classes ======================================================

function DiffFormatter(revHtml, prevHtml) {
  //  Remove end comments
  this.revHtml  = revHtml;
  this.prevHtml = prevHtml;

  this.contentParts = [ ];
  this.totalAdded = 0;
  this.totalRemoved = 0;
  this.editCount = 0;
}

DiffFormatter.prototype.findEndIndexOfTagNamed = function(name, startIndex) {
  for (closingTagIndex = startIndex; closingTagIndex < this.diffParts.length; closingTagIndex++) {
    var tag = this.diffParts[closingTagIndex];

    if (tag.tagName === name && tag.isClosingTag) {
      return closingTagIndex;
    }
  }

  return -1;
};

DiffFormatter.prototype.processChangeInOpenTag = function(openTagIndex, closingTagIndex) {
  var oldOpenTag = this.diffParts[openTagIndex];
  var newOpenTagIndex = openTagIndex + 1;
  var newOpenTag;

  for (; newOpenTagIndex < closingTagIndex - 1; newOpenTagIndex++) {
    var candidateNewOpenTag = this.diffParts[newOpenTagIndex];

    if (oldOpenTag.tagName === candidateNewOpenTag.tagName &&
        candidateNewOpenTag.isOpeningTag &&
        candidateNewOpenTag.isAddition) {
      newOpenTag = candidateNewOpenTag;
      break;
    }
  }

  if (!newOpenTag) {
    //  If we can't find the tag that is to replace this tag, treat this like
    //  an entirely new tag has been added.
    return this.processTagAdditionOrDeletion(openTagIndex, closingTagIndex);
  }

  var closingTag = this.diffParts[closingTagIndex];
  var partsWithinTag = this.diffParts.slice(newOpenTagIndex + 1, closingTagIndex);

  var partsBetweenOldAndNewTags = this.diffParts.slice(openTagIndex + 1, newOpenTagIndex);

  var oldContent = getOldContentString(partsWithinTag);
  var newContent = getNewContentString(partsWithinTag);

  var oldPreContent = getOldContentString(partsBetweenOldAndNewTags);
  var newPreContent = getNewContentString(partsBetweenOldAndNewTags);

  this.pushSubtraction(oldPreContent + oldOpenTag.content + oldContent + closingTag.content);
  this.pushAddition(newPreContent + newOpenTag.content + newContent + closingTag.content);
};

DiffFormatter.prototype.pushAddition = function(html) {
  this.contentParts.push(this.wrapInAdditionSpan(html));
};

DiffFormatter.prototype.pushSubtraction = function(html) {
  this.contentParts.push(this.wrapInSubtractionSpan(html));
};

DiffFormatter.prototype.wrapInAdditionSpan = function(html) {
  this.totalAdded += html.length;
  return this.wrapInSpan('additions', html);
};

DiffFormatter.prototype.wrapInSubtractionSpan = function(html) {
  this.totalRemoved += html.length;
  return this.wrapInSpan('subtractions', html);
};

DiffFormatter.prototype.wrapInSpan = function(klass, html) {
  if (html.trim() === "") {
    return "";
  }

  var output = (
    '<span class="ww-edit ' + klass + '" id="edit-' + (this.editCount++) + '">' +
    ((html.indexOf("<") === 0) ? (" " + html + " ") : html) +
    '</span>'
  );

  return output;
};

DiffFormatter.prototype.processTagAdditionOrDeletion = function(openTagIndex, closingTagIndex) {
  var tagAdded = this.diffParts[openTagIndex].isAddition;
  var tagRemoved = this.diffParts[openTagIndex].isDeletion;

  var openingTag = this.diffParts[openTagIndex];
  var closingTag = this.diffParts[closingTagIndex];
  var partsWithinTag = this.diffParts.slice(openTagIndex + 1, closingTagIndex);

  var oldContent = getOldContentString(partsWithinTag);
  var newContent = getNewContentString(partsWithinTag);

  if (tagAdded) {
    if (oldContent) {
      this.pushSubtraction(oldContent);
    }

    this.pushAddition(openingTag.content + newContent + closingTag.content);
  } else {
    this.pushSubtraction(openingTag.content + oldContent + closingTag.content);

    if (newContent) {
      this.pushAddition(newContent);
    }
  }
};

DiffFormatter.prototype.process = function() {
  var revHtml = this.revHtml.split("\n\n<!--")[0];
  var prevHtml = this.prevHtml.split("\n\n<!--")[0];

  try {
    this.diffParts = getDiffParts(revHtml, prevHtml);

    var startTime = +new Date();

    for (var i = 0; i < this.diffParts.length; i++) {
      var difference = this.diffParts[i];

      if (difference.isAddition || difference.isDeletion) {
        if (difference.isOpeningTag && !difference.isClosingTag) {
          var closingTagIndex = this.findEndIndexOfTagNamed(difference.tagName, i);

          if (closingTagIndex !== -1) {
            if (closingTagIndex === i) {
              //  Deal with self-closing tags
              this.processChangeInOpenTag(i, closingTagIndex);
            } else {
              var closingTag = this.diffParts[closingTagIndex];

              if (closingTag.isAddition === difference.isAddition &&
                  closingTag.isDeletion === difference.isDeletion) {
                this.processTagAdditionOrDeletion(i, closingTagIndex);
              } else {
                this.processChangeInOpenTag(i, closingTagIndex);
              }

              i = closingTagIndex;

              continue;
            }
          } else {
            log.warn("Could not find closing tag for:", JSON.stringify(difference));
          }
        }

        if (difference.isAddition) {
          this.pushAddition(difference.content);
        } else {
          this.pushSubtraction(difference.content);
        }
      } else {
        this.contentParts.push(difference.content);
      }
    }

    var endTime = +new Date();

    log.info("Formatted diff into HTML in " + (endTime - startTime) + " msec.");
  } catch (err) {
    log.error(err);
    
    this.contentParts = [ 'Diff unavailable' ];
  }
};

DiffFormatter.prototype.generateDiff = function() {
  this.process();

  return {
    content: this.contentParts.join(""),
    added: this.totalAdded,
    removed: this.totalRemoved,
    editCount: this.editCount,
  };
};

// == Exports ===============================================================

module.exports = DiffFormatter;
