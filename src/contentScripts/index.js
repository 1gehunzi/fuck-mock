

const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.extension.getURL('interceptor.js'));
console.log(script, chrome.extension.getURL('interceptor.js'))
document.documentElement.appendChild(script);
// console.log('document.head', document.head)
// document.head.prepend(script)

