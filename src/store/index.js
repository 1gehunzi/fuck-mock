// ajaxInterceptor_switchOn 总开关
// ajaxInterceptor_rules
/**
 * rule object
 * {
 *  label: '接口名称',
 *  match: '正则 or path',
 *  switchOn: 'true or false',
 *  overrideTxt: 'responce txt'
 * }
 */
// chrome.storage.sync.set({key: value}, function() {
//     console.log('Value is set to ' + value);
// });

// chrome.storage.sync.get(['key'], function(result) {
//     console.log('Value currently is ' + result.key);
// });
export const AJAX_INTERCEPTOR_SWITCHON = 'ajaxInterceptor_switchOn'
export const AJAX_INTERCEPTOR_RULES = 'ajaxInterceptor_rules'
// TODO: 无法获取storage的值
export const getStorageItem = (key) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result[key])
    })
  })
}
// 数据的保持
export const saveStorage = (key, value) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, (result) => {
      resolve(result)
    })

    chrome.runtime.sendMessage({
      info: "我是 content.js"
    })
  })
}
