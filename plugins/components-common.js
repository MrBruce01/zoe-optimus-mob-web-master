/**
 * 自定义布局ui插件
 * Created by jiangzhenhua on 2017/12/4
 */
import Vue from 'vue'
import Common from '../components/common'
import dateFormat from '../utils/dateFormat'

Vue.use(Common)
Vue.prototype.$format = dateFormat
