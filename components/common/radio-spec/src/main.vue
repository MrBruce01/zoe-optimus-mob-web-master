<template>
    <div>
        <mt-cell :title="label" class="zm-radio mint-field">
            <input :placeholder="placeholder"
                   type="text"
                   :readonly="!editable"
                   style="margin-right: 14px;"
                   v-model="currentContent"
                   @click="onHandleClick"
                   class="mint-field-core"/>
            <span class="mintui mintui-back reset" @click="popupVisible=true"></span>
            <mt-popup class="zm-radio-popup"
                      position="bottom"
                      v-model="popupVisible"
                      popup-transition="popup-fade"
                      :style="{height: popupHeight}"
                      ref="pop">
                <zm-container>
                    <zm-main ref="zmRadioMain">
                        <div @click="popupVisible=false">
                            <mt-radio style="width: 100%"
                                      :title="label"
                                      align="right"
                                      v-model="currentValue"
                                      :options="options">
                            </mt-radio>
                        </div>
                    </zm-main>
                </zm-container>
            </mt-popup>
        </mt-cell>
        <div class="zm-radio-textfield-list">
            <zm-textfield-list :fieldList="portions"></zm-textfield-list>
        </div>
    </div>
</template>
<script>
  import _ from 'lodash'

  export default {
    name: 'ZmSpecRadio',
    componentName: 'ZmSpecRadio',
    props: {
      label: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      code: {
        type: String,
        default: ''
      },
      portions: {
        type: Array,
        default () {
          return []
        }
      },
      enableSegment: {
        type: Boolean,
        default: false
      },
      dictContent: {
        type: String,
        default: null
      },
      content: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: '未选择'
      },
      editable: {
        type: Boolean,
        default: false
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
              value: 'valueName',
              code: 'valueCode'
            }
          }
        }
      }
    },
    mounted () {
      document.body.appendChild(this.$refs.pop.$el)
    },
    data () {
      return {
        options: [],
        popupVisible: false,
        popupHeight: 'auto',
        currentValue: this.value,
        currentContent: this.value,
        dictItems: []
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
                value: item[props.label],
                code: item[props.value]
              })
            })
          })
        }
        this.options = this.dictItems
        this.currentValue = this.value
        console.log('label:' + this.currentContent)
        let height = this.options.length * 48
        let maxHeight = window.innerHeight * 0.5
        if (height > maxHeight) {
          this.popupHeight = maxHeight + 'px'
          let scrollHeight = maxHeight * maxHeight / height
          this.$refs.zmRadioMain.setScroll(scrollHeight, window.innerWidth)
        }
      },
      currentValue () {
        console.log('currentValue-currentValue:' + this.currentValue)
        this.$emit('input', this.currentValue)
        this.$emit('update:content', this.currentValue)
        let content = this.content
        let label = ''
        let code = ''
        for (let item of this.options) {
          if (_.isEqual(item.label, this.currentValue)) {
            label = item.label
            code = item.code
            break
          }
        }
        if (this.editable) {
          content += label
        } else {
          content = label
        }
        console.log('currentValue-code:' + code)
        this.$emit('update:code', code)
        this.$emit('change', this.currentValue)
        this.currentContent = content

        if (this.enableSegment) {
          if (!_.isEmpty(this.classId)) {
            let param = {
              dictItemSegmentRltList: [
                {
                  projectCode: '1',
                  deCode: this.classId,
                  basicDictName: this.dictId,
                  basicDictValueCode: this.currentValue
                }]
            }
            this.$his5http.post('template/segment/dictItemSegmentRlt/findListByList',
              param
            ).then((res) => {
              let extendSegment = []
              if (res.data.length !== 0) {
                res.data.forEach(data => {
                  let segment = JSON.parse(data.segmentJsonContent)
                  segment.forEach(textField => {
                    if (_.isObject(textField)) {
                      textField.value = textField.code
                      textField.type = textField.textFieldType
                      if (textField.hasOwnProperty('portions')) {
                        this.addFldType(textField.portions)
                      }
                    }
                    extendSegment.push(textField)
                  })
                })
              }
              this.$emit('update:portions', extendSegment)
            })
          }
        }
      }
    },
    methods: {
      onHandleClick () {
        if (!this.editable) {
          this.popupVisible = true
        }
      },
      addFldType (portions) {
        for (let portion of portions) {
          if (_.isObject(portion)) {
            portion.type = portion.textFieldType
            if (portion.hasOwnProperty('portions')) {
              this.addFldType(portion.portions)
            }
          }
        }
      }
    }
  }
</script>

<style>
    .zm-radio-popup {
        width: 100%;
        /*height: calc(100%);*/
        /*overflow: auto;*/
    }

    .zm-radio-popup .zm-radio-selects {
        position: absolute;
        left: 0;
        margin-left: 60px;
        margin-top: 2px;
    }

    .zm-radio-popup .zm-radio-toolbar {
        border-bottom: 1px solid #eaeaea;
        border-top: 1px solid #eaeaea;
        height: 40px;
    }

    .zm-radio-popup .zm-radio-toolbar .buttons {
        display: inline-block;
        width: 50%;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        color: #26a2ff;
    }

    .zm-radio .reset {
        display: inline-block;
        transform: rotate(-90deg);
        color: #868686;
        position: absolute;
        right: 10px;
        top: 14px;
    }

    .zm-radio-textfield-list {
        margin-left: 20px;
    }
</style>
