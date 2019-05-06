const config = {
  default: {
    //baseURL: 'http://192.168.2.191:8080/zoe-optimus-mobile-web/',
    // baseURL: 'http://117.25.173.18:7008/zoe-optimus-mobile-web/',
    baseURL: 'http://192.168.2.164:7008/zoe-optimus-mobile-web/',
    // baseURL: 'http://10.0.1.174:8081/zoe-optimus-mobile-web/',
    timeout: 60000,
    headers: {
      'deptCode': '1010320',
      'langType': 'zh',
      'operator': '12917',
      'orgCode': '2',
      'apiKey': 'HIS5',
      'requestId': Date.now()
    }
  },
  his5: {
    // baseURL: 'http://192.168.2.226:8082/zoe-optimus-web-api/'
      baseURL: 'http://192.168.2.191:8080/zoe-optimus-mobile-web/'
  }
}
export default config
