/* eslint-disable no-continue */
// 在页面上插入代码
import { proxy } from 'ajax-hook'
import { stringify } from 'flatted'
import FetchInterceptor from '@/fetch-interceptor'

const sendMsg = (msg) => {
  const str = stringify(msg)
  // msg.toStri
  const event = new CustomEvent('xxxxxxxxxxxx', { detail: str })
  window.dispatchEvent(event)
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
    console.log(config)
    mockCore(config.url, config)
      .then((response) => {
        const result = {
          config,
          status: 200,
          headers: [],
          response,
        }
        sendMsg(response)
        handler.resolve(result)
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
  FetchInterceptor.register({
    onBeforeRequest(request, controller) {
      // Hook before request
      console.log('onBeforeRequest', request)
        // const tmp = payload
        // const text = JSON.stringify(tmp)
        // const responce = new Response()
        // responce.json = () => Promise.resolve(tmp)
        // responce.text = () => Promise.resolve(text)
        //  return Promise.resolve(responce)
    },
    onRequestSuccess(response, request, controller) {
      // Hook on response success
      // TODO: 数据格式化，流是不能直接转成字符串的
      sendMsg({config: {url: request.url, method: request.method}, status: 200})
      console.log('onRequestSuccess', request)
    },
    onRequestFailure(response, request, controller) {
      // Hook on response failure
      console.log('onRequestFailure', response, request)
    },
  })
}
