<template>
    <zm-container>
        <!--<zm-header height="41px">-->
        <!--<mt-header :title="title">-->
        <!--<router-link to="/" slot="left">-->
        <!--<mt-button icon="back">返回</mt-button>-->
        <!--</router-link>-->
        <!--<mt-button icon="more" slot="right"></mt-button>-->
        <!--</mt-header>-->
        <!--</zm-header>-->
        <zm-header height="50px">
            <mt-navbar v-model="selected">
                <mt-tab-item :key="item.id" :id="item.id" v-for="item in odtData">
                    {{ item.name }}
                </mt-tab-item>
            </mt-navbar>
        </zm-header>
        <zm-main ref="containerMain">
            <mt-tab-container v-model="selected">
                <mt-tab-container-item :key="group.id" :id="group.id" v-for="group in odtData">
                    <zm-textfield-list :fieldList="group.data"
                                       @de-script-validate="deScriptValidate"></zm-textfield-list>
                </mt-tab-container-item>
            </mt-tab-container>
        </zm-main>
        <zm-footer height="41px">
            <mt-header title="">
                <mt-button type="primary" @click.native="handleSaveClick" slot="right">保&nbsp;&nbsp;&nbsp;存</mt-button>
            </mt-header>
        </zm-footer>
        <mt-popup v-model="scriptTipVisible" popup-transition="popup-fade" class="zm-popup" :closeOnClickModal="false">
            <div v-for="result in messages">
                <mt-cell>
                    <img slot="icon" src="../../assets/img/tip.png" v-if="result.level === '0'" height="16" width="16">
                    <img slot="icon" src="../../assets/img/warn.png" v-else-if="result.level === '1'" height="16" width="16">
                    <img slot="icon" src="../../assets/img/error.png" v-else-if="result.level === '2'" height="16" width="16">
                    <zm-field :label="levelFormatter(result.level)" :readonly="true" :disableClear="true">
                        <span>{{result.message}}</span>
                    </zm-field>
                </mt-cell>
            </div>
            <div>
                <mt-button type="primary" @click.native="handleConfirmSave"
                           size="small" class="zm-popup-btn">确&nbsp;&nbsp;定</mt-button>
            </div>
        </mt-popup>
    </zm-container>
</template>
<script>
  import {Toast, Indicator} from 'mint-ui'
  import _ from 'lodash'
  import MtCell from '../../node_modules/mint-ui/packages/cell/src/cell.vue'

  export default {
    components: {MtCell},
    layout: 'odt',
    head () {
      return {
        title: this.title
      }
    },
    mounted () {
      let templateId = this.$route.query.templateId
      let eventNo = this.$route.query.eventNo
      let operationType = this.$route.query.operationType

      if (_.isEmpty(templateId) ||
        _.isEmpty(eventNo) ||
        _.isEmpty(operationType)) {
        return
      }

      Indicator.open({
        text: '加载中...'
      })

      this.$his5http.post('emr/nursingMobileForm/getMobileTemplate', {
        templateId: templateId,
        operationType: operationType,
        eventNo: eventNo
      }).then((res) => {
        this.emrId = res.data.emrId
        let odtData = this.odtData = res.data.emrContent
        console.log('getMobileTemplate:' + JSON.stringify(odtData))
        if (odtData && odtData.length > 0) {
          this.selected = odtData[0].id
        }

        odtData.getTextfieldByClassId = function (classId) {
          for (let group of odtData) {
            for (let fld of group.data) {
              if (_.isEqual(fld.classId, classId)) {
                fld.getId = function () {
                  return fld.id
                }
                fld.setCode = function (code) {
                  if (fld.value !== code) {
                    fld._dirty_ = true
                    fld.value = code
                  }
                }
                fld.getCode = function () {
                  return fld.value
                }
                fld.setContent = function (content) {
                  if (fld.content !== content) {
                    fld._dirty_ = true
                    fld.content = content
                  }
                }
                fld.getContent = function () {
                  return fld.content
                }
                fld.setTitle = function (title) {
                  if (fld.title !== title) {
                    fld._dirty_ = true
                    fld.title = title
                  }
                }
                fld.getTitle = function () {
                  return fld.title
                }
                fld.setNodeType = function (nodeType) {
                  if (fld.nodeType !== nodeType) {
                    fld._dirty_ = true
                    fld.nodeType = nodeType
                  }
                }
                fld.getNodeType = function () {
                  return fld.nodeType
                }
                fld.setDefaultValue = function (defaultValue) {
                  if (fld.defaultValue !== defaultValue) {
                    fld._dirty_ = true
                    fld.defaultValue = defaultValue
                  }
                }
                fld.getDefaultValue = function () {
                  return fld.defaultValue
                }
                fld.setRelativeDe = function (relativeDe) {
                  if (fld.relativeDe !== relativeDe) {
                    fld._dirty_ = true
                    fld.relativeDe = relativeDe
                  }
                }
                fld.getRelativeDe = function () {
                  return fld.relativeDe
                }
                fld.setClientDomainCode = function (clientDomainCode) {
                  if (fld.clientDomainCode !== clientDomainCode) {
                    fld._dirty_ = true
                    fld.clientDomainCode = clientDomainCode
                  }
                }
                fld.getClientDomainCode = function () {
                  return fld.clientDomainCode
                }
                fld.setDisplayType = function (displayType) {
                  if (fld.displayType !== displayType) {
                    fld._dirty_ = true
                    fld.displayType = displayType
                  }
                }
                fld.getDisplayType = function () {
                  return fld.displayType
                }
                fld.setBusinessType = function (businessType) {
                  if (fld.businessType !== businessType) {
                    fld._dirty_ = true
                    fld.businessType = businessType
                  }
                }
                fld.getBusinessType = function () {
                  return fld.businessType
                }
                fld.setToUpdate = function (toUpdate) {
                  if (fld.toUpdate !== toUpdate) {
                    fld._dirty_ = true
                    fld.toUpdate = toUpdate
                  }
                }
                fld.getToUpdate = function () {
                  return fld.toUpdate
                }
                fld.setParse = function (parse) {
                  if (fld.parse !== parse) {
                    fld._dirty_ = true
                    fld.parse = parse
                  }
                }
                fld.getParse = function () {
                  return fld.parse
                }
                fld.setDictId = function (dictId) {
                  if (fld.dictId !== dictId) {
                    fld._dirty_ = true
                    fld.dictId = dictId
                  }
                }
                fld.getDictId = function () {
                  return fld.dictId
                }
                fld.setTextFieldType = function (textFieldType) {
                  if (fld.textFieldType !== textFieldType) {
                    fld._dirty_ = true
                    fld.textFieldType = textFieldType
                  }
                }
                fld.getTextFieldType = function () {
                  return fld.textFieldType
                }
                return fld
              }
            }
          }
        }
      }).finally(() => {
        Indicator.close()
      })

      this.$his5http.post('template/script/emrScript/getTemplateScripts', {
        templateId: templateId
      }).then(res => {
        for (let script of res.data) {
          this.$his5http.post('template/script/emrScript/getScriptInfo', {
            projectCode: '1',
            scriptId: script.SCRIPT_ID,
            scriptName: script.SCRIPT_NAME
          }).then(result => {
            if (_.isEqual(script.SCRIPT_TYPE, '0')) {
              this.templateScript.push(result.data)
            } else {
              this.$his5http.post('template/script/emrScript/getDeScriptList', {
                templateId: templateId,
                scriptId: script.SCRIPT_ID
              }).then(de => {
                result.data.deCode = []
                for (let deScpt of de.data) {
                  result.data.deCode.push(deScpt.deCode)
                }
              })
              this.deScript.push(result.data)
            }
          })
        }
      })
    },
    data () {
      return {
        title: '护理评估录入',
        selected: '0',
        emrId: '',
        odtData: [],
        templateScript: [],
        deScript: [],
        scriptTipVisible: false,
        messages: [],
        scriptType: '',
        haveErrorMsg: false,
        messageLevelOption: [
          {
            label: '提示',
            value: '0'
          },
          {
            label: '警告',
            value: '1'
          },
          {
            label: '错误',
            value: '2'
          }
        ]
      }
    },
    methods: {
      handleSaveClick () {
        this.scriptType = '模板脚本'
        this.scriptValidate(this.templateScript)
        if (!this.scriptTipVisible) {
          this.saveMobileTemplate()
        }
      },
      handleConfirmSave () {
        this.scriptTipVisible = false
        if (_.isEqual(this.scriptType, '模板脚本') && !this.haveErrorMsg) {
          this.saveMobileTemplate()
        }
      },
      saveMobileTemplate () {
        Indicator.open({
          text: '正在保存...'
        })

        function findFld (ret, arr) {
          for (let fld of arr) {
            if (_.isObject(fld) && !_.isNull(fld.textFieldType)) {
              if (fld._dirty_) {
                ret.push({
                  id: fld.id,
                  content: fld.content,
                  value: fld.value,
                  type: fld.type,
                  textFieldType: fld.textFieldType,
                  portions: fld.portions
                })
              }

              if (_.isArray(fld.portions)) {
                findFld(ret, fld.portions)
              }
            }
          }
        }

        let flds = []
        for (let group of this.odtData) {
          findFld(flds, group.data)
        }
        console.log(JSON.stringify(flds))
        this.$his5http.post('emr/nursingMobileForm/saveMobileTemplate', {
          record: {
            templateCode: this.$route.query.templateId,
            eventNo: this.$route.query.eventNo,
            patientId: this.$route.query.patientId,
            title: this.$route.query.title
          },
          emrId: this.emrId,
          contentJson: JSON.stringify(flds)
        }).then(res => {
          Toast({
            message: '保存成功',
            iconClass: 'mintui mintui-success'
          })

          function clearDirty (arr) {
            for (let fld of arr) {
              if (_.isObject(fld) && !_.isNull(fld.textFieldType)) {
                fld._dirty_ = false
                if (_.isArray(fld.portions)) {
                  clearDirty(fld.portions)
                }
              }
            }
          }

          for (let group of this.odtData) {
            clearDirty(group.data)
          }
        }).catch(() => {
          Toast({
            message: '保存失败',
            iconClass: 'mintui mintui-error'
          })
        }).finally(() => {
          Indicator.close()
        })
      },
      invokeJavaScript (script) {
        let fn = new Function('doc', script) // eslint-disable-line
        return fn(this.odtData)
      },
      deScriptValidate (classId) {
        let deScriptArrary = []
        for (let script of this.deScript) {
          for (let deCode of script.deCode) {
            if (classId === deCode) {
              deScriptArrary.push(script)
            }
          }
        }
        this.scriptType = '数据元脚本'
        this.scriptValidate(deScriptArrary)
      },
      scriptValidate (scripts) {
        this.messages = []
        this.haveErrorMsg = false
        for (let script of scripts) {
          if (!_.isEmpty(script.contentString)) {
            let result = this.invokeJavaScript(script.contentString)
            if (result !== undefined) {
              for (let data of result) {
                if (_.isEqual(data.level, '2')) {
                  this.haveErrorMsg = true
                }
                this.messages.push(data)
              }
            }
          }
        }

        if (this.messages.length > 0) {
          this.scriptTipVisible = true
        }
      },
      levelFormatter (level) {
        return _.result(_.find(this.messageLevelOption, {value: level}), 'label')
      }
    },
    watch: {
      selected () {
        this.$refs.containerMain.hideScroll()
      }
    }
  }
</script>
<style>
    .zm-popup {
        width: 80%;
    }
    .zm-popup .mint-field .mint-cell-title {
      width: 50px;
    }
    .zm-popup .mint-field .mint-cell-value {
      color: black;
    }
    .zm-popup .zm-popup-btn {
      float: right;
    }
</style>

