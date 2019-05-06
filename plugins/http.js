/**
 * http 插件
 * Created by jiangzhenhua on 2017/12/4
 */
import Vue from 'vue'
import { http, his5http } from '~/utils/httpUtils'

Vue.prototype.$http = http
Vue.prototype.$his5http = his5http
