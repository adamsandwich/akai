import _ from 'lodash'

const storageKey = 'bookmark'

export const getTabs = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ [storageKey]: [] }, function (tabs) {
      resolve(tabs.bookmark)
    })
  })
}
export const setTabs = (tabs) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [storageKey]: tabs }, function () {
      resolve()
    })
  })
}
export const createTab = (tab) => {
  chrome.tabs.create({ url: tab.url }, function () {
  })
}
export const getCurrentTabs = () => {
  return new Promise((resolve) => {
    chrome.tabs.query({ pinned: false }, function (tabs) {
      let tidyTabs = tabs.map(element => {
        return _.pick(element, ['favIconUrl', 'id', 'index', 'title', 'url'])
      })
      resolve(_.unionBy(tidyTabs, 'url'))
    })
  })
}