/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable no-continue */
// 在页面上插入代码
import { proxy } from 'ajax-hook'
import { stringify } from 'flatted'
import Url from 'url-parse'
import { pathToRegexp } from 'path-to-regexp'
import FetchInterceptor from '@/fetch-interceptor'
import type { Project, ProjectStorage, NetworkItem , MethodType, Request, Response } from './type'
export const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'
export const INJECT_ELEMENT_ID = 'ajaxInterceptor'
/**
 * 用户界面的 ajax 请求log，发给插件层
 * @param {*} msg
 */
const sendMsg = (msg: NetworkItem) => {
  console.log(msg, '------------------------ log')
  const str = stringify(msg)
  const event = new CustomEvent(CUSTOM_EVENT_NAME, { detail: str })
  window.dispatchEvent(event)
}
//
function mockCore(url: string, method: string) {
  const inputElem = document.getElementById(INJECT_ELEMENT_ID) as HTMLInputElement
  const configStr = inputElem.value
  const config: ProjectStorage = JSON.parse(configStr)
  // 看下插件设置的数据结构
  const targetUrl = new Url(url)
  const str = targetUrl.pathname
  const { ajaxInterceptor_current_project, ajaxInterceptor_projects } = config

  const currentProject =
    ajaxInterceptor_projects?.find(
      (item) => item.name === ajaxInterceptor_current_project
    ) || ({} as Project)

  return new Promise((resolve, reject) => {
    // 进入 mock 的逻辑判断
    if (currentProject.switchOn) {
      const rules = currentProject.rules || []
      const currentRule = rules.find((item) => {
        const re = pathToRegexp(item.path) // 匹配规则
        const match1 = re.exec(str)

        return item.method === method && match1 && item.switchOn
      })

      if (currentRule) {
        setTimeout(() => {
          resolve({
            response: currentRule.response,
            rulePath: currentRule.path,
            status: currentRule.status,
          })
        }, currentRule.delay || 0)

        return
      }
    }
    reject()
  })
}

proxy({
  onRequest: (config, handler) => {
    // TODO: url 对象里面的信息非常有用啊
    const url = new Url(config.url)

    const request: Request = {
      url: url.href,
      method: config.method as MethodType,
      headers: config.headers,
      type: 'xhr',
    }
    mockCore(url.href, config.method)
      .then((res) => {
        const { response, rulePath, status } = res || {}
        const result = {
          config,
          status,
          headers: [],
          response: JSON.stringify(response),
        }
        const payload: NetworkItem = {
          request,
          response: {
            status: result.status,
            headers: result.headers,
            statusText: result.statusText,
            url: result.url,
            response: result,
            isMock: true,
            rulePath,
          },
        }
        sendMsg(payload)
        handler.resolve(result)
      })
      .catch(() => {
        // console.log(config, 'dddddddddddddd')
        handler.next(config)
      })
  },
  onResponse: (response, handler) => {
    const { statusText, status, config, headers, response: res } = response

    const url = new Url(config.url)
    const payload: NetworkItem = {
      request: {
        method: config.method as MethodType,
        url: url.href,
        headers: config.headers,
        type: 'xhr',
      },
      response: {
        status,
        statusText,
        url: config.url,
        headers: headers,
        response: res,
      } ,
    }
    sendMsg(payload)

    handler.resolve(response)
  },
})

if (window.fetch !== undefined) {
  FetchInterceptor.register({
    onBeforeRequest(request, controller) {
      return mockCore(request.url, request.method).then((res) => {
        try {
          const { rulePath, status } = res || {}
          const text = JSON.stringify(res.response)
          const response = new Response()
          response.json = () => Promise.resolve(res.response)
          response.text = () => Promise.resolve(text)
          response.isMock = true
          // response.status = status
          response.rulePath = rulePath
          return response
        } catch (err) {
          console.error(err)
        }
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
      if (response.isMock) {
        response.json().then((res) => {
          const result = {
            // config,
            status: response.status,
            headers: [],
            response: JSON.stringify(res),
            isMock: true,
            rulePath: response.rulePath
          }
          payload.response = result
          sendMsg(payload)
        })
      } else {
        const cloneRes = response.clone()
        cloneRes.json().then((res) => {
          const result = {
            // config,
            status: response.status,
            headers: [],
            response: JSON.stringify(res),
          }
          payload.response = result
          sendMsg(payload)
        })
      }
    },
    onRequestFailure(response, request) {
      const payload:NetworkItem = {
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
          response: {
            headers: [],
            response: '',
          }
        },
      }

      sendMsg(payload)
    },
  })
}
