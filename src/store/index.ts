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
export const AJAX_INTERCEPTOR_PROJECTS = 'ajaxInterceptor_projects'
export const AJAX_INTERCEPTOR_CURRENT_PROJECT = 'ajaxInterceptor_current_project'

export const getStorageItem = (key: string) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key])
    })
  })
}
// 数据的保持
export const saveStorage = (key: string, value: any) => {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    chrome.storage.local.set({ [key]: value }, (result) => {
      resolve(result)
    })
  })
}
