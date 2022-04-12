const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', chrome.extension.getURL('interceptor.js'))
document.documentElement.appendChild(script)

const input = document.createElement('input')
input.setAttribute('id', 'ajaxInterceptor')
input.setAttribute('style', 'display:none')
document.documentElement.appendChild(input)

const keys = ['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules']

const executeScript = (data) => {
  const code = JSON.stringify(data)
  document.getElementById('ajaxInterceptor').value = code
}
const injectGlobalData = () => {
  chrome.storage.local.get(keys, (result) => {
    console.log('chrome.storage.local.get(keys, (result)', result)
    executeScript(result)
  })
}
// TODO: 设置 icon 是否生效
injectGlobalData()

chrome.storage.onChanged.addListener((changes, namespace) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (keys.find((item) => item === key)) {
      console.log(
        '--------------chrome.storage.onChanged------------------',
        oldValue,
        newValue,
        namespace
      )
      injectGlobalData()
    }
  }
})
