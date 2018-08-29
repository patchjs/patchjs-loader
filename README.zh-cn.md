# Patch.js

## 介绍

Patch.js 是一个字符级增量更新的脚本加载工具，更快的加载速度、更少的用户流量。

## 版本引用（建议内联）

```html
<script src="./patchjs-loader/2.0.0/websqldb.js"></script>
<script src="./patchjs-loader/2.0.0/index.js"></script>
```

## API 

```js
patchjs.config({
  path: 'http://static.domain.com/path/to/',
  cache: true,
  increment: true,
  version: '0.1.2'
}).load('index.css').load('common.js').wait().load('index.js', function (url, fromCache) {
  // fromCache 
});
```

## 配置项

**cache** `Boolean`

**default** `false`

是否启用缓存功能。

<br/>

**increment** `Boolean`

**default** `false`

是否启用增量加载功能。

<br/>

**count** `Number`

**default** `5`

修订号向下自动降级多少个版本范围内，将会被保存。
<br/>

**path** `String`

静态文件 URL 的前缀；建议通过运行时的域名，根据不同部署环境，指定对应的 URL。 

例如: 

URL: `http://static.domain.com/path/to/1.0.0/file.js`

path: `http://static.domain.com/path/to/`

<br/>

**version** `String`

当前页面的版本号。

<br/>

**env** `String`

配置部署环境，用于隔离不同环境的缓存， 例如： dev, test, pre, prod。

<br/>

**exceedQuotaErr** `Function`

当本地存储空间不足时，会触发这个回调函数。

## URL 规范

[STATIC_URL_PREFIX]/[VERSION]/[FILE_NAME]-[LOCAL_VERSION].[FILE_EXT]

例如: http://static.domain.com/path/to/1.0.1/file-1.0.0.js

## Diff 结果

{"m":[IS_MODIFIED],"l":[CHUNK_SIZE],"c":[CODE_DATA]}

eg: {"m":true,"l":20,"c":['var num = 0;']}

## 其他

1. 支持 localStorage / Web SQL Database / IndexedDB 缓存方式, 但是只需选择其中一个。

2. 如果在页面删除 Patch.js 的脚本加载器，必须在 webpack.config.js 中删除 PatchjsWebpackPlugin。

