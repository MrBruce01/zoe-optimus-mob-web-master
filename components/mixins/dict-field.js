import _ from 'lodash'

export default {
  props: {
    props: {
      type: Object,
      default () {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    content: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '未选择'
    },
    dictId: {
      type: String,
      default: null
    },
    dictServiceInfo: {
      type: Object,
      default () {
        return {
          url: '/template/dict/stdDict/findDictItemList',
          props: {
            label: 'valueName',
            value: 'valueCode'
          }
        }
      }
    },
    dictData: {
      type: Array,
      default: function () {
        return []
      }
    },
    editable: {
      type: Boolean,
      default: false
    },
    dirty: {
      type: Boolean,
      default: false
    },
    classId: {
      type: String,
      default: null
    },
    dictContent: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      dictItems: [],
      currentContent: this.dictContent || this.content
    }
  },
  watch: {
    popupVisible (val) {
      if (!val || !_.isEmpty(this.dictItems)) {
        return
      }
      let dictId = this.dictId
      let dictURL = this.dictServiceInfo.url
      let props = this.dictServiceInfo.props
      if (!_.isEmpty(dictURL) && !_.isEmpty(dictId) && dictId !== '0') {
        let opts = this.dictItems = []
        this.$his5http.post(dictURL, {
          dictIdStr: dictId
        }).then(function (res) {
          res.data.forEach(item => {
            opts.push({
              label: item[props.label],
              value: item[props.value]
            })
          })
        })
      }
    },
    dictData: {
      handler (val) {
        if (!_.isEmpty(val)) {
          let opts = this.dictItems = []
          val.forEach(item => {
            opts.push({
              label: item[this.props.label],
              value: item[this.props.value]
            })
          })
        }
      },
      immediate: true
    },
    currentContent (val) {
      this.$emit('update:dirty', true)
      this.$emit('update:content', val)
      this.$emit('script-validate', this.classId)
    }
  }
}
