var loaderUtils = require("loader-utils");
var htmlMinifier = require("html-minifier");
var jhtmls = require('jhtmls');

var _jhtmls = function (template, isWith) {
  var content = 'var exports = null;';
  content += "\
        var htmlEncodeDict = {\
            '\"': 'quot',\
            '<': 'lt',\
            '>': 'gt',\
            '&': 'amp',\
            ' ': 'nbsp'\
        };\
    ";

  function encodeHTML(text) {
    text = typeof text === 'undefined' ? '' : text;
    return String(text).replace(/["<>& ]/g, function (all) {
      return '&' + htmlEncodeDict[all] + ';';
    });
  }
  function render(data, helper) {
    var format = function (d, h) {
      var _require;
      if (typeof require === 'function') {
        _require = require;
      }
      var output = [];
      if (typeof h === 'undefined') {
        h = function (d) {
          build.call(d, output, encodeHTML, h, exports, _require);
        };
      }
      build.call(d, output, encodeHTML, h, exports, _require);
      return output.join('');
    };
    return format(data, helper);
  }
  var build = jhtmls.build(template).toString();
  // 去掉 with 可压缩
  if (isWith) {
    build = build.replace(/with\(this\){/i, "");
    build = build.replace(/\}$/i, "");
  }

  content += 'var build = ' + build + ';';
  content += encodeHTML.toString();
  content += render.toString();
  return content;
};

module.exports = function (source) {
  if (this.cacheable) this.cacheable();
  var query = loaderUtils.parseQuery(this.query);
  // 压缩

  var minimizeOptions = Object.assign({}, query);
  if (typeof query.minimize === "boolean" ? query.minimize : this.minimize) {
    [
      "removeComments",
      "removeCommentsFromCDATA",
      "removeCDATASectionsFromCDATA",
      "collapseWhitespace",
      "conservativeCollapse",
      //"removeAttributeQuotes",
      "useShortDoctype",
      "keepClosingSlash",
      "minifyJS",
      //"minifyCSS",
      "removeScriptTypeAttributes",
      "removeStyleTypeAttributes",
      "preserveLineBreaks"
    ].forEach(function (name) {
      if (typeof minimizeOptions[name] === "undefined") {
        minimizeOptions[name] = true;
      }
    });
    source = htmlMinifier.minify(source, minimizeOptions);
  }

  source = source.replace(/(\n\r)|(\r\n)|(\r)|(\n)/g, '\n\r');
  source = _jhtmls(source, query.with) + 'module.exports = render;';
  return source;
};

