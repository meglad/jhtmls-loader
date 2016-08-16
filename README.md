# jhtmls-loader
--------------------------------
[![npm](https://img.shields.io/npm/v/jhtmls-loader.svg)](https://www.npmjs.com/package/jhtmls-loader)

[jhtmls](https://github.com/zswang/jhtmls) 模版的 webpack 预编译 loader

## 安装

$ npm install jhtmls-loader

## 说明 (模版具体用法请看 [https://github.com/zswang/jhtmls](https://github.com/zswang/jhtmls))

```js
var data = {...};
var render = require('jhtmls!./template.html');   // 返回渲染函数
document.body.innerHTML = render(data);
```

### LICENSE MIT