
// 在页面上插入代码
import { proxy } from 'ajax-hook'

console.log('dfdfdfdf')
function hijack(url, { method }) {
  console.log('---------', url, method)
  return new Promise((resolve) => {
    // 稍后再替换这段代码
    console.log(`拦截请求 ${method} ${url}`)
  resolve()
})
}

console.log(proxy)

proxy({
  onRequest: (config, handler) =>{
    console.log('config, handler', config, handler)
    hijack(config.url, config)
      .then(({ response }) => {
        return handler.resolve({
          config,
          status: 200,
          headers: [],
          response,
        })
      })
      .catch((err) => {
        console.log('dfgdgdgdgd-----', err)
        handler.next(config)
      })
  },
  onResponse: (response, handler) => {
    handler.resolve(response)
  },
})

if (window.fetch) {
  console.log('-----------------------', window.fetch)
  const f = window.fetch
  window.fetch = (req, config) => {
    console.log('reqxxxxxxx', config)
    return hijack(req, config)
      .then(({ response }) => {
        return new Response(response, {
          headers: new Headers([]),
          status: 200,
        })
      })
      .catch(() => f(req, config))
  }
}

