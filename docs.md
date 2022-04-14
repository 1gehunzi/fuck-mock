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

调研清楚为什么有的url带host, 有的不带呢
