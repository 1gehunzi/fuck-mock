import {
  AJAX_INTERCEPTOR_PROJECTS,
  AJAX_INTERCEPTOR_CURRENT_PROJECT,
} from '@/store'

const keys = [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT]

function injectScriptToPage() {
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', chrome.extension.getURL('interceptor.js'))
  document.documentElement.appendChild(script)

  const input = document.createElement('input')
  input.setAttribute('id', 'ajaxInterceptor')
  input.setAttribute('style', 'display:none')
  document.documentElement.appendChild(input)
}
const executeScript = (data) => {
  const code = JSON.stringify(data)
  if (document.getElementById('ajaxInterceptor')) {
    document.getElementById('ajaxInterceptor').value = code
  }
}
// 让 storage 的数据实时反映到页面上
const setGlobalData = () => {
  chrome.storage.local.get(keys, (result) => {
    executeScript(result)
  })
}
chrome.storage.local.get(keys, (result) => {
  const currentName = result[AJAX_INTERCEPTOR_CURRENT_PROJECT]
  const projectList = result[AJAX_INTERCEPTOR_PROJECTS] || []
  // eslint-disable-next-line no-restricted-globals
  const { origin } = location
  const currentProject =
    projectList.find((item) => item.name === currentName) || {}
  // 注意host和origin是否带结尾的 slush
  if (origin === currentProject.host) {
    injectScriptToPage()
    setGlobalData()
  }
})

window.addEventListener(
  'CUSTOMEVENT',
  (event) => {
    chrome.runtime.sendMessage(chrome.runtime.id, {
      type: 'ajaxInterceptor',
      to: 'background',
      detail: event.detail,
    })
  },
  false
)

chrome.storage.onChanged.addListener((changes, namespace) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    // console.log(namespace, oldValue, newValue)
    if (keys.find((item) => item === key)) {
      setGlobalData()
    }
  }
})
