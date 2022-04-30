import {
  AJAX_INTERCEPTOR_PROJECTS,
  AJAX_INTERCEPTOR_CURRENT_PROJECT,
} from '@/store'

let ftdWindow = null

chrome.windows.onRemoved.addListener((windowId) => {
  if (ftdWindow && ftdWindow.id === windowId) {
    chrome.browserAction.setBadgeText({ text: '' })
    ftdWindow = null
  }
})

const defaultProject = {
  name: 'localhost',
  origin: 'http://localhost:8080',
  color: '#409EFF',
  switchOn: true,
}

chrome.runtime.onInstalled.addListener(function () {
  console.log('当前环境变量NODE_ENV => ', process.env.NODE_ENV)
  // 区分开发环境还是生产环境
  if (process.env.NODE_ENV !== 'development') {
    chrome.storage.local.set(
      {
        [AJAX_INTERCEPTOR_PROJECTS]: [defaultProject],
        [AJAX_INTERCEPTOR_CURRENT_PROJECT]: defaultProject.name,
      },
      function () {
        console.log('The color is green.')
      }
    )
  }
})

chrome.browserAction.onClicked.addListener(function () {
  if (ftdWindow) {
    console.log('The window exists!')
    const info = {
      focused: true,
    }
    chrome.windows.update(ftdWindow.id, info, (w) => {
      if (!w) {
        ftdWindow = null
      }
    })
  } else {
    chrome.storage.local.get(['windowSize'], function (result) {
      console.log(`storage.sync`)
      let width = 1000
      let height = 700
      if (result.windowSize) {
        width = parseInt(result.windowSize.width)
        height = parseInt(result.windowSize.height)
      }
      const left = parseInt((window.screen.width - width) / 2)
      const top = parseInt((window.screen.height - height) / 2)

      chrome.windows.create(
        {
          url: chrome.runtime.getURL('webContent.html'),
          type: 'popup',
          left,
          top,
          width,
          height,
        },
        function (window) {
          ftdWindow = window
        }
      )
    })
  }
})
