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
- [x] 单条规则的开启关闭
- [x] 404 的接口拦截，编辑规则出错, 开启和关闭的状态。path 前面加get和post的汇总
- [x] fetch 的拦截的bug  (zhihu的网站好像不太对)
- [x] get 和 状态码的默认值不对
- [x] 侧导航的name要...啊
- [x] rule 编辑的时候，get 和 post 不算作一个接口？
- [x] rule 表单编辑允许重命名吧
- [x] 删除和点击日志展示详情有bug
- [x] fetch 404的处理
- [x] 编辑项目名称，currentName的问题修复
- [x] json 的中文编辑问题
- [x] 搜索功能添加
- [ ] 鼠标点击的锚点均有问题
- [ ] path-to-regexp 的优化
- [ ] 支持改用户请求的request, 类似 postman 的穿透
- [ ] 文档和宣传
- [ ] 两个项目的情况下，编辑第二个有bug
- res query
-

## 环境
接入 typescript
https://dev.to/codeoz/webpack-academy-bonus-use-webpack-with-typescript-vuejs-sass-38ff
https://cherrow.top/posts/5141e527

http://forbeslindesay.github.io/express-route-tester/
https://www.npmjs.com/package/path-to-regexp

https://www.cnblogs.com/Ewarm/p/12965069.html 的教程

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
