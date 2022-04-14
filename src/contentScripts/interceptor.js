/* eslint-disable no-continue */
// 在页面上插入代码
import { proxy } from 'ajax-hook'
import { stringify } from 'flatted'
import FetchInterceptor from '@/fetch-interceptor'

const sendMsg = (msg) => {
  const str = stringify(msg)
  // msg.toStri
  const event = new CustomEvent('CUSTOMEVENT', { detail: str })
  window.dispatchEvent(event)
}
//
function mockCore(url, method) {
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
      if (method === matchRule.method && matchRule.path === url) {
        console.log(
          matchRule.switchOn,
          matchRule.method,
          method,
          matchRule.path,
          url,
          matchRule.path === url
        )
      }

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
    const request = {
      url: config.url,
      method: config.method,
      headers: config.headers,
      type: 'xhr',
    }
    mockCore(config.url, config.method)
      .then((response) => {
        const result = {
          config,
          status: 200,
          headers: [],
          response,
        }
        const payload = {
          request,
          response: {
            status: result.status,
            headers: result.headers,
            statusText: result.statusText,
            url: result.url,
            response: result,
          },
        }

        sendMsg(payload)
        handler.resolve(result)
      })
      .catch((err) => {
        handler.next(config)
      })
  },
  onResponse: (response, handler) => {
    const { statusText, status, config, headers, response: res } = response
    const payload = {
      request: {
        method: config.method,
        url: config.url,
        headers: config.headers,
        type: 'xhr',
      },
      response: {
        status,
        statusText,
        url: config.url,
        headers: res.headers,
        response: res.response,
      },
    }

    sendMsg(payload)

    handler.resolve(response)
  },
})

if (window.fetch) {
  FetchInterceptor.register({
    onBeforeRequest(request, controller) {
      // Hook before request
      // const tmp = payload
      // const text = JSON.stringify(tmp)
      // const responce = new Response()
      // responce.json = () => Promise.resolve(tmp)
      // responce.text = () => Promise.resolve(text)
      //  return Promise.resolve(responce)

      return mockCore(request.url, request.method).then((res) => {
        const text = JSON.stringify(res)
        const response = new Response()
        response.json = () => Promise.resolve(res)
        response.text = () => Promise.resolve(text)
        response.mock = true
        return response
      })
    },
    onRequestSuccess(response, request) {
      const payload = {
        request: {
          type: 'fetch',
          method: request.method,
          url: request.url,
          headers: request.headers,
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: response.headers,
          response: '',
        },
      }
      // TODO: 数据格式化，流是不能直接转成字符串的, 如何获取到 response 中的字符串返回
      if (response.mock) {
        response.json().then((res) => {
          payload.response = res
          sendMsg(payload)
        })
      } else {
        const cloneRes = response.clone()
        cloneRes.json().then((res) => {
          payload.response = res
          sendMsg(payload)
        })
      }
    },
    onRequestFailure(response, request, controller) {
      // Hook on response failure
      console.log('onRequestFailure', response, request)
    },
  })
}
