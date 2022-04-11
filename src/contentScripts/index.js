

const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.extension.getURL('interceptor.js'));
console.log(script, chrome.extension.getURL('interceptor.js'))
document.documentElement.appendChild(script);
// console.log('document.head', document.head)
// document.head.prepend(script)

// TODO: 设置 icon 是否生效
chrome.storage.local.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules'], (result) => {
  console.log(result)
  // if (result.hasOwnProperty('ajaxInterceptor_switchOn')) {
  //   if (result.ajaxInterceptor_switchOn) {
  //     chrome.browserAction.setIcon({path: "/images/16.png"});
  //   } else {
  //     chrome.browserAction.setIcon({path: "/images/16_gray.png"});
  //   }
  // }
});
