Patch.js is a incremental(character level) script loader for mobile web.

## Reference

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

## Options

**cache** `Boolean`

**default** `false`


<br/>

**increment** `Boolean`

**default** `false`

It enables the cache function.

<br/>

**count** `Number`

**default** `5`

how many incremental versions are cached.

<br/>

**path** `String`

the URL prefix of a static file.

eg: 

URL: `http://static.domain.com/path/to/1.0.0/file.js`

Prefix: `http://static.domain.com/path/to/`

<br/>

**version** `String`

the current page of version, .

<br/>

**env** `String`

environment configuration, such as dev, test, pre, prod.

<br/>

**exceedQuotaErr** `Function`

when the quota isn't enough, trigger the function of exceedQuotaErr.


