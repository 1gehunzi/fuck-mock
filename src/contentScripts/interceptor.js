/* eslint-disable no-continue */
// 在页面上插入代码
import { proxy } from 'ajax-hook'
import { stringify } from 'flatted'
import Url from 'url-parse'
import {pathToRegexp, match } from 'path-to-regexp'
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
  const targetUrl = new Url(url)
  // const str = targetUrl.pathname + targetUrl.query
  const str = targetUrl.pathname



  console.log(targetUrl)
  return new Promise((resolve, reject) => {
    // 进入 mock 的逻辑判断
    if (config.ajaxInterceptor_switchOn) {
      const rules = config.ajaxInterceptor_rules || []
      const currentRule = rules.find(item => {
        const re = pathToRegexp(item.path);     // 匹配规则
        const match1 = re.exec(str);
        console.log(match1, item.path, str, '----------------------------------')
        return item.switchOn && item.method === method && match1
      })

      console.log('----------------currentRule----------------', rules, currentRule);

      if (currentRule) {
         // url 路径
        console.log('拦截请求', method, url, currentRule.response)

        resolve(currentRule.response)
      }
    }
    reject()
  })
}

proxy({
  onRequest: (config, handler) => {
    // TODO: url 对象里面的信息非常有用啊
    const url = new Url(config.url)
    console.log('onRequest', config.url, url)

    const request = {
      url: url.href,
      method: config.method,
      headers: config.headers,
      type: 'xhr',
    }
    mockCore(url.href, config.method)
      .then((response) => {
        const result = {
          config,
          status: 200,
          headers: [],
          // TODO: 为啥要 stringfy 呢
          response: JSON.stringify(response)
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
    console.log('onResponse-----------------', response)
    const { statusText, status, config, headers, response: res } = response
        const url = new Url(config.url)
    const payload = {
      request: {
        method: config.method,
        url: url.href,
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
