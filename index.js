var loaderUtils = require("loader-utils");
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

  var module = {};
  eval(source);

  source = _jhtmls(module.exports, query.with) + 'module.exports = render;';
  return source;
};