/* eslint-disable no-continue */
// 在页面上插入代码
import { proxy } from 'ajax-hook'
import { parse, stringify } from 'flatted';

// import { EventBus } from "@/event-bus";
const sendMsg = msg => {
  console.log(msg, 'responce')
  const str = stringify(msg)
  // msg.toStri
  const event = new CustomEvent("xxxxxxxxxxxx", {detail: str});
  window.dispatchEvent(event);
}
//
function mockCore(url, { method }) {
  const configStr = document.getElementById('ajaxInterceptor').value
  const config = JSON.parse(configStr)

  return new Promise((resolve, reject) => {
    // 进入 mock 的逻辑判断
    if (config.ajaxInterceptor_switchOn) {
      // const matchRule = config.ajaxInterceptor_rules.find(rule => {
      //   // 此处逻辑需要进一步调整，精确匹配、正则、在创业公司用的接口
      //   return rule.path === url
      // })
      const matchRule = config.ajaxInterceptor_rules
      console.log(
        matchRule.switchOn,
        matchRule.method,
        method,
        matchRule.path,
        url,
        matchRule.path === url
      )
      if (
        matchRule.switchOn &&
        method === matchRule.method &&
        matchRule.path === url
      ) {
        console.log('拦截请求', config, method, url, matchRule.response)

        resolve(matchRule.response)
      }
    }
    reject()
  })
}

proxy({
  onRequest: (config, handler) => {
    console.log('config, handler', config, handler)
    mockCore(config.url, config)
      .then((response) => {
        handler.resolve({
          config,
          status: 200,
          headers: [],
          response,
        })
      })
      .catch((err) => {
        handler.next(config)
      })
  },
  onResponse: (response, handler) => {
    // EventBus.$emit("aMsg", response);
    // Chrome提供的大部分API是不支持在content_scripts中运行
    // sendMessage onMessage 是可以使用

    sendMsg(response)

    handler.resolve(response)
  },
})

if (window.fetch) {
  const f = window.fetch
  window.fetch = (req, config) => {
    // 此处的 req 和 config 的含义和具体使用方式需要调整一下
    return mockCore(req.url, req)
      .then(({ response }) => {
        return new Response(response, {
          headers: new Headers([]),
          status: 200,
        })
      })
      .catch(() => f(req, config))
  }
}
