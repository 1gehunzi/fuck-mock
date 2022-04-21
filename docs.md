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

## TODO List
- [x] logs 页面的清空操作
- [x] 首次安装插件的项目初始化
- [x] project Item 用个蓝色
- [x] 项目的删除变成 dialog
- [x] 项目编辑重名操作
- [x] 项目的表单校验
- [x] origin 设置
- [x] 规则表单校验
- [x] json 输入框不友好
- [x] 规则编辑重名操作
- [ ] 404 的接口拦截，编辑规则出错
- [ ] 单条规则的开启关闭
- [ ] 规则的添加要支持项目级别
- [ ] 鼠标点击的锚点均有问题
- [ ] path-to-regexp 的优化
- [ ] fetch 的拦截
- [ ] 文档和宣传

调试环境：
微信公众号是 xhr
leetcode是 fetch

## 最重要的事情，把代码优化下。都是demo代码，太乱了

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
