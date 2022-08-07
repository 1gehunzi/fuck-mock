import {
  AJAX_INTERCEPTOR_PROJECTS,
  AJAX_INTERCEPTOR_CURRENT_PROJECT,
} from '@/store'
import { CUSTOM_EVENT_NAME, INJECT_ELEMENT_ID } from './interceptor'
import type { Project, ProjectStorage } from './type'
const keys = [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT]
export const EXTENSION_EVENT_NAME = 'ajaxInterceptor'
/**
 * 将插件的 ajax hooks 文件注册到用户目标页面中去
 */
function injectScriptToPage() {
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', chrome.extension.getURL('interceptor.js'))
  document.documentElement.appendChild(script)

  const input = document.createElement('input')
  input.setAttribute('id', INJECT_ELEMENT_ID)
  input.setAttribute('style', 'display:none')
  document.documentElement.appendChild(input)
}
const executeScript = (data: ProjectStorage) => {
  const code = JSON.stringify(data)
  const inputElem = document.getElementById(
    INJECT_ELEMENT_ID
  ) as HTMLInputElement
  if (inputElem !== null) {
    inputElem.value = code
  }
}
// 让 storage 的数据实时反映到页面上
const setGlobalData = () => {
  chrome.storage.local.get(keys, (result) => {
    executeScript(result as ProjectStorage)
  })
}
chrome.storage.local.get(keys, (result) => {
  const currentName = result[AJAX_INTERCEPTOR_CURRENT_PROJECT]
  const projectList: Project[] = result[AJAX_INTERCEPTOR_PROJECTS] || []

  // eslint-disable-next-line no-restricted-globals
  const { origin } = location
  const currentProject =
    projectList.find((item) => item.name === currentName) || ({} as Project)
  if (origin === currentProject.origin) {
    injectScriptToPage()
    setGlobalData()
  }
})

// CUSTOMEVENT 事件的作用是什么： 让页面的请求信息 （network logs）, 反馈给插件页面
window.addEventListener(
  CUSTOM_EVENT_NAME,
  (event: any) => {
    chrome.runtime.sendMessage(chrome.runtime.id, {
      type: EXTENSION_EVENT_NAME,
      to: 'background',
      detail: event.detail,
    })
  },
  false
)
/**
 * 监听插件的操作界面，设置拦截规则，设置项目的打开关闭或者规则的开启关闭，实时通知给用户的页面
 */
chrome.storage.onChanged.addListener((changes) => {
  // eslint-disable-next-line no-restricted-syntax
  // for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
  for (const [key] of Object.entries(changes)) {
    if (keys.find((item) => item === key)) {
      setGlobalData()
    }
  }
})
