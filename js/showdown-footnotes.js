(function (extension) {
  'use strict';

  if (typeof showdown !== 'undefined') {
    // global (browser or nodejs global)
    extension(showdown);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['showdown'], extension);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension(require('showdown'));
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }

}(function (showdown) {
  'use strict';

  showdown.extension('footnotes', function () {
    return [
      {
        type: 'lang',
        filter: text => text.replace(
          /^\[\^([\d\w]+)\]:\s*((\n+(\s{2,4}|\t).+)+)$/mg,
          (str, name, rawContent, _, padding) => {
            const content = converter.makeHtml(rawContent.replace(new RegExp(`^${padding}`, 'gm'), ''))
            return `<div class="footnote" id="footnote-${name}"><a href="#footnote-source-${name}"><sup>[${name}]</sup></a>:${content}</div>`
          }
        )
      },
      {
        type: 'lang',
        filter: text => text.replace(
          /^\[\^([\d\w]+)\]:( |\n)((.+\n)*.+)$/mg,
          (str, name, _, content) =>
            `<small class="footnote" id="footnote-${name}"><a href="#footnote-source-${name}"><sup>[${name}]</sup></a>: ${content}</small>`
        )
      },
      {
        type: 'lang',
        filter: text => text.replace(
          /\[\^([\d\w]+)\]/mg,
          (str, name) => `<a href="#footnote-${name}" id="footnote-source-${name}"><sup>[${name}]</sup></a>`
        )
      }
    ];
  });
}));



