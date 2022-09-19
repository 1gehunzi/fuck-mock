/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * FIXME: 类型设计
 * 使用开源库进行改造
 * https://github.com/itsfadnis/fetch-interceptor/blob/master/src/index.js
 */
export default class FetchInterceptor {
  env: any
  fetch: any
  isRealRequest: boolean // 是否真的发送请求给后端
  // _instance: typeof FetchInterceptor
  private static _instance: FetchInterceptor
  /**
   * Recognize global environment and attach fetch
   */
  constructor() {
    const ENVIRONMENT_IS_REACT_NATIVE =
      typeof navigator === 'object' && navigator.product === 'ReactNative'
    const ENVIRONMENT_IS_NODE =
      typeof process === 'object' && typeof require === 'function'
    const ENVIRONMENT_IS_WEB = typeof window === 'object'
    const ENVIRONMENT_IS_WORKER = typeof importScripts === 'function'

    if (ENVIRONMENT_IS_REACT_NATIVE) {
      this.env = global
    } else if (ENVIRONMENT_IS_WORKER) {
      this.env = self
    } else if (ENVIRONMENT_IS_WEB) {
      this.env = window
    } else if (ENVIRONMENT_IS_NODE) {
      this.env = global
    } else {
      throw new Error('Unsupported environment for fetch-intercept')
    }

    this.fetch = this.env.fetch
  }

  /**
   * Whitelist hooks
   */
  static hooks = ['onBeforeRequest', 'onRequestSuccess', 'onRequestFailure']

  /**
   * Register intercept hooks & return an interceptor instance
   * @param {object} hooks - The intercept hooks
   * @return {FetchInterceptor} An interceptor object
   */
  static register(hooks: any = {}, isRealRequest = false) {
    if (this._instance) {
      return this._instance
    }
    const interceptor = new this()
    for (let i = 0; i < this.hooks.length; i++) {
      const hook = this.hooks[i]
      if (typeof hooks[hook] === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        interceptor[hook] = hooks[hook]
      }
    }
    interceptor.isRealRequest = isRealRequest
    interceptor.hijack()
    this._instance = interceptor
    return interceptor
  }

  /**
   * Reset fetch and unregister intercept hooks
   */
  unregister() {
    this.env.fetch = this.fetch
    delete this.constructor._instance
  }

  /**
   * Hijack global fetch and insert registered hooks if present
   */
  hijack() {
    const controller = new AbortController()
    const signal = controller.signal
    this.env.fetch = (...a) => {
      let request
      if (a[0] instanceof Request) {
        const object = {}
        ;[
          'cache',
          'context',
          'credentials',
          'destination',
          'headers',
          'integrity',
          'method',
          'mode',
          'redirect',
          'referrer',
          'referrerPolicy',
          'url',
          'body',
          'bodyUsed',
        ].forEach(prop => {
          if (prop in a[0]) {
            object[prop] = a[0][prop]
          }
        })
        object.signal = signal
        const { url, ...options } = object
        request = new Request(url, options)
      } else {
        const url = a[0]
        const options = {
          ...a[1],
          signal,
        }
        request = new Request(url, options)
      }
      /** TODO: start 改造 fetch request start 的位置 xyy */
      let beforeReqPromise

      if (typeof this.onBeforeRequest === 'function') {
        beforeReqPromise = this.onBeforeRequest(request, controller)
      }
      // 如果 request 之前返回了 promise, 则将 promise 给
      // const promise = beforeReqPromise || this.fetch.call(this.env, request)
      const promise = this.isRealRequest
        ? this.fetch.call(this.env, request)
        : beforeReqPromise
            .then(res => res)
            .catch(() => {
              return this.fetch.call(this.env, request)
            })
      if (typeof this.onAfterRequest === 'function') {
        this.onAfterRequest(request, controller)
      }

      /** end 改造 fetch request end 的位置, 需要把 promise  xyy */
      return promise
        .then(async response => {
          if (this.isRealRequest) {
            try {
              const mockResponse = await beforeReqPromise
              if (mockResponse) {
                response = mockResponse
              }
            } catch (error) {
              // noop
            }
          }
          if (response.ok) {
            if (typeof this.onRequestSuccess === 'function') {
              this.onRequestSuccess(response, request, controller)
            }
          } else {
            if (typeof this.onRequestFailure === 'function') {
              this.onRequestFailure(response, request, controller)
            }
          }
          return response
        })
        .catch(error => {
          if (typeof this.onRequestFailure === 'function') {
            this.onRequestFailure(error, request, controller)
          }
          throw error
        })
    }
  }
}
