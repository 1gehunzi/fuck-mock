## request

method: "GET" | "POST"
url: "string" 带域名 or 不带域名
headers： {}

## response

status: 200
statusText: ""
url
headers
response

```js
const payload = {
  request: {
    method: '',
    url: '',
    headers: {}
  },
  response: {
    status: 200
    statusText: ""
    url: ""
    headers: {}
    response: ""
  }
}
```

## TODO:
* 先把 mock 做好
* 设置接口相应时间
* 404 的接口快速获取
* 区分是mock还是穿透
* 为什么有的 url 带着 host, you

调研清楚为什么有的url带host, 有的不带呢
"path-to-regexp": "2.4.0",
"qs": "^6.9.6",

https://www.jianshu.com/p/7d2dbfdd1b0f 的使用方法
```js
var pathToRegexp = require('path-to-regexp')

var re = pathToRegexp('/foo/:bar');     // 匹配规则
var match1 = re.exec('/test/route');    // url 路径
var match2 = re.exec('/foo/route');     // url 路径

console.log(match1);
console.log(match2);
```

Uncaught (in promise) InvalidStateError: Failed to set the 'withCredentials' property on 'XMLHttpRequest': The value may only be set if the object's state is UNSENT or OPENED.
