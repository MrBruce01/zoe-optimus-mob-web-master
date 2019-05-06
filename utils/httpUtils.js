import axios from 'axios'
import qs from 'qs'
import config from '../config'
import _ from 'lodash'

function initHttp (module) {
  let options = _.clone(config.default)
  _.merge(options, config[module])
  let axiosInstant = axios.create(options)
  axiosInstant.all = axios.all
  axiosInstant.spread = axios.spread

  axiosInstant.interceptors.request.use(function (config) {
    if (typeof config.data === 'object') {
      let params = qs.stringify({parameter: JSON.stringify(config.data)})
      config.data = params
    }

    config.headers.requestId = new Date().getTime()
    return config
  }, function (error) {
    console.log('请求失败,原因：' + error)
  })

  axiosInstant.interceptors.response.use(function (response, b) {
    response.data.success = response.data.code === '00000'
    if (!response.data.success) {
      console.log('业务请求失败，地址：' + response.config.url)
      console.log('原因：' + response.data.message)
      console.log(response.data.error)
      return Promise.reject(new Error('业务请求失败（' + response.data.message + ')'))
    }
    let data = response.data.data
    response.data = data
    return response
  }, function (error) {
    console.log('http请求失败，地址：' + error.config.url)
    console.log('原因：' + error)
    return Promise.reject(new Error('http请求失败（' + error + ')'))
  })
  return axiosInstant
}

export default initHttp

let http = initHttp('default')
let his5http = initHttp('his5')

export { http, his5http }
