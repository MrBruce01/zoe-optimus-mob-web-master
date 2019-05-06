/**
 * web与原生app交互插件
 * Created by jiangzhenhua on 2017/12/4
 */
import Vue from 'vue'

function mobileEventhandler (slotName, options) {
  let func = window.__mobileHanders__[slotName]
  let ot = options
  if (typeof ot === 'string') {
    ot = JSON.parse(options)
  }
  if (func) {
    func(ot)
  } else {
    let msg = 'Web client unimplemented event receiver, event name:' + slotName
    window.console.warn(msg)
    window.alert(msg)
  }
}

function registerMobileEvent (slotName, func) {
  if (typeof window.__callZoeWebJs === 'undefined') {
    window.__callZoeWebJs = mobileEventhandler
  }

  if (typeof window.__mobileHanders__ === 'undefined') {
    window.__mobileHanders__ = {}
  }
  window.__mobileHanders__[slotName] = func
}

function execMobileEvent (soltName, options) {
  let ot = options
  if (typeof ot === 'undefined') {
    window.__zoeMobileClient.exec(soltName)
    return
  } else if (typeof ot === 'object') {
    ot = JSON.stringify(options)
  }
  window.__zoeMobileClient.exec(soltName, ot)
}

function isMobile () {
  if (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true
  } else {
    return false
  }
}

Vue.prototype.$registerMobileEvent = registerMobileEvent
Vue.prototype.$execMobileEvent = execMobileEvent
Vue.prototype.$isMobile = isMobile
