/**
 * Created by jiangzhenhua on 2017/12/12
 *
 *  对Date的扩展，将 Date 转化为指定格式的String
 *  月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *  年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *  例子：
 *  (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *  (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */

const dateFormat = function (fmt, dt) {
  if (typeof dt === 'undefined') {
    dt = new Date()
  }
  var o = {
    'M+': dt.getMonth() + 1,
    'd+': dt.getDate(),
    'h+': dt.getHours(),
    'm+': dt.getMinutes(),
    's+': dt.getSeconds(),
    'q+': Math.floor((dt.getMonth() + 3) / 3),
    'S': dt.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
export default dateFormat
