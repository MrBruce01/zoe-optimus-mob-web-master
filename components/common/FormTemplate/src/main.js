import { Field } from 'mint-ui'
import Vue from 'vue'
import Dirty from '~/components/mixins/dirty'

let ZmField = Vue.extend({
  name: 'ZmField',
  mixins: [Field]
})

ZmField.mixin(Dirty)

export default ZmField
